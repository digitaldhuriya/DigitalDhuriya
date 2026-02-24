import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientStatus, LeadStatus, Prisma } from '@digital-dhuriya/database';
import { PrismaService } from '../prisma/prisma.service';
import { AssignClientServicesDto } from './dto/assign-client-services.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

const clientInclude = {
  activeServices: {
    where: { isActive: true },
    include: { service: true },
  },
  projects: {
    select: { id: true, name: true, status: true, deadline: true },
  },
  quotations: {
    select: { id: true, quotationNumber: true, status: true, total: true },
  },
  invoices: {
    select: {
      id: true,
      invoiceNumber: true,
      status: true,
      total: true,
      amountReceived: true,
      balance: true,
    },
  },
  crmNotes: {
    orderBy: { createdAt: 'desc' },
    take: 10,
  },
  lead: {
    select: { id: true, companyName: true, status: true },
  },
} satisfies Prisma.ClientInclude;

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  private toDate(value?: string): Date | undefined {
    return value ? new Date(value) : undefined;
  }

  async create(dto: CreateClientDto) {
    return this.prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          companyName: dto.companyName,
          contactName: dto.contactName,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          country: dto.country,
          gstNumber: dto.gstNumber,
          contractStart: this.toDate(dto.contractStart),
          contractEnd: this.toDate(dto.contractEnd),
          status: dto.status ?? ClientStatus.ACTIVE,
          leadId: dto.leadId,
        },
      });

      if (dto.leadId) {
        await tx.lead.update({
          where: { id: dto.leadId },
          data: { status: LeadStatus.WON },
        });
      }

      if (dto.activeServiceIds?.length) {
        await tx.clientService.createMany({
          data: dto.activeServiceIds.map((serviceId) => ({
            clientId: client.id,
            serviceId,
            isActive: true,
          })),
        });
      }

      return tx.client.findUnique({
        where: { id: client.id },
        include: clientInclude,
      });
    });
  }

  findAll(search?: string) {
    const where: Prisma.ClientWhereInput = search
      ? {
          OR: [
            { companyName: { contains: search, mode: 'insensitive' } },
            { contactName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.prisma.client.findMany({
      where,
      include: clientInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: clientInclude,
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.client.update({
        where: { id },
        data: {
          companyName: dto.companyName,
          contactName: dto.contactName,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          country: dto.country,
          gstNumber: dto.gstNumber,
          contractStart: dto.contractStart ? new Date(dto.contractStart) : undefined,
          contractEnd: dto.contractEnd ? new Date(dto.contractEnd) : undefined,
          status: dto.status,
          leadId: dto.leadId,
        },
      });

      if (dto.activeServiceIds) {
        await tx.clientService.updateMany({
          where: { clientId: id, isActive: true },
          data: { isActive: false },
        });

        if (dto.activeServiceIds.length > 0) {
          await tx.clientService.createMany({
            data: dto.activeServiceIds.map((serviceId) => ({
              clientId: id,
              serviceId,
              isActive: true,
            })),
          });
        }
      }

      return tx.client.findUnique({
        where: { id },
        include: clientInclude,
      });
    });
  }

  async assignServices(id: string, dto: AssignClientServicesDto) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.clientService.updateMany({
        where: { clientId: id, isActive: true },
        data: { isActive: false },
      });

      if (dto.serviceIds.length) {
        await tx.clientService.createMany({
          data: dto.serviceIds.map((serviceId) => ({
            clientId: id,
            serviceId,
            isActive: true,
          })),
        });
      }

      return tx.client.findUnique({
        where: { id },
        include: clientInclude,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.client.delete({ where: { id } });
    return { message: 'Client deleted successfully' };
  }
}

