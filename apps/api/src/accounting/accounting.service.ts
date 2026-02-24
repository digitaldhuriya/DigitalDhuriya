import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@digital-dhuriya/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [invoices, paidCount, pendingCount] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { status: { not: InvoiceStatus.CANCELLED } },
        select: {
          total: true,
          amountReceived: true,
          balance: true,
        },
      }),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.PAID } }),
      this.prisma.invoice.count({
        where: {
          status: {
            in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE],
          },
        },
      }),
    ]);

    const totalInvoiced = invoices.reduce((sum, item) => sum + Number(item.total), 0);
    const totalReceived = invoices.reduce((sum, item) => sum + Number(item.amountReceived), 0);
    const outstanding = invoices.reduce((sum, item) => sum + Number(item.balance), 0);

    return {
      totalInvoiced: Math.round(totalInvoiced * 100) / 100,
      totalReceived: Math.round(totalReceived * 100) / 100,
      outstanding: Math.round(outstanding * 100) / 100,
      paidInvoices: paidCount,
      pendingInvoices: pendingCount,
    };
  }

  async monthlyRevenue(year = new Date().getFullYear()) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        issueDate: {
          gte: start,
          lt: end,
        },
        status: { not: InvoiceStatus.CANCELLED },
      },
      select: {
        issueDate: true,
        amountReceived: true,
      },
    });

    const monthly = Array.from({ length: 12 }).map((_value, monthIndex) => ({
      month: monthIndex + 1,
      revenue: 0,
    }));

    invoices.forEach((invoice) => {
      const month = invoice.issueDate.getMonth();
      monthly[month].revenue += Number(invoice.amountReceived);
    });

    return monthly.map((item) => ({
      ...item,
      revenue: Math.round(item.revenue * 100) / 100,
    }));
  }
}

