import { Injectable, NotFoundException } from '@nestjs/common';
import { CommissionStatus } from '@digital-dhuriya/database';
import { PrismaService } from '../prisma/prisma.service';
import { MarkCommissionPaidDto } from './mark-commission-paid.dto';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: { status?: CommissionStatus; salesPersonId?: string }) {
    return this.prisma.commission.findMany({
      where: {
        status: filters.status,
        salesPersonId: filters.salesPersonId,
      },
      include: {
        salesPerson: {
          select: { id: true, name: true, email: true },
        },
        lead: {
          select: { id: true, companyName: true, contactName: true },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            amountReceived: true,
            total: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async summary() {
    const commissions = await this.prisma.commission.findMany({
      include: {
        salesPerson: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const map = new Map<
      string,
      {
        salesPersonId: string;
        salesPersonName: string;
        totalEarned: number;
        totalPaid: number;
        totalPending: number;
      }
    >();

    for (const commission of commissions) {
      const key = commission.salesPersonId;
      const record =
        map.get(key) ||
        {
          salesPersonId: key,
          salesPersonName: commission.salesPerson.name,
          totalEarned: 0,
          totalPaid: 0,
          totalPending: 0,
        };

      const amount = Number(commission.commissionAmount);
      record.totalEarned += amount;

      if (commission.status === CommissionStatus.PAID) {
        record.totalPaid += amount;
      }

      if (commission.status === CommissionStatus.PENDING || commission.status === CommissionStatus.EARNED) {
        record.totalPending += amount;
      }

      map.set(key, record);
    }

    return Array.from(map.values());
  }

  async markPaid(id: string, dto: MarkCommissionPaidDto) {
    const existing = await this.prisma.commission.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Commission not found');
    }

    return this.prisma.commission.update({
      where: { id },
      data: {
        status: CommissionStatus.PAID,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
      },
    });
  }
}

