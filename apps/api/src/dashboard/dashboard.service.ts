import { Injectable } from '@nestjs/common';
import { InvoiceStatus, ProjectStatus } from '@digital-dhuriya/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      activeProjects,
      monthlyRevenueAgg,
      pendingPaymentsAgg,
      tasks,
      overdueInvoices,
    ] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.project.count({
        where: {
          status: {
            in: [ProjectStatus.PLANNED, ProjectStatus.IN_PROGRESS, ProjectStatus.ON_HOLD],
          },
        },
      }),
      this.prisma.invoice.aggregate({
        where: {
          issueDate: { gte: startOfMonth },
          status: { not: InvoiceStatus.CANCELLED },
        },
        _sum: { amountReceived: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          status: {
            in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE],
          },
        },
        _sum: { balance: true },
      }),
      this.prisma.task.findMany({
        include: {
          assignedTo: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.invoice.count({
        where: {
          dueDate: { lt: now },
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID] },
        },
      }),
    ]);

    const performanceMap = new Map<
      string,
      {
        userId: string;
        userName: string;
        assignedTasks: number;
        completedTasks: number;
      }
    >();

    tasks.forEach((task) => {
      if (!task.assignedTo) {
        return;
      }

      const key = task.assignedTo.id;
      const existing =
        performanceMap.get(key) ||
        {
          userId: key,
          userName: task.assignedTo.name,
          assignedTasks: 0,
          completedTasks: 0,
        };

      existing.assignedTasks += 1;
      if (task.status === 'DONE') {
        existing.completedTasks += 1;
      }

      performanceMap.set(key, existing);
    });

    const teamPerformance = Array.from(performanceMap.values()).map((entry) => ({
      ...entry,
      completionRate:
        entry.assignedTasks > 0
          ? Math.round((entry.completedTasks / entry.assignedTasks) * 100)
          : 0,
    }));

    return {
      totalLeads,
      activeProjects,
      monthlyRevenue: Number(monthlyRevenueAgg._sum.amountReceived || 0),
      pendingPayments: Number(pendingPaymentsAgg._sum.balance || 0),
      overdueInvoices,
      teamPerformance,
    };
  }

  async getRevenueTrend(months = 6) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        issueDate: { gte: startDate },
        status: { not: InvoiceStatus.CANCELLED },
      },
      select: {
        issueDate: true,
        amountReceived: true,
      },
    });

    const map = new Map<string, number>();

    for (let index = months - 1; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, 0);
    }

    invoices.forEach((invoice) => {
      const key = `${invoice.issueDate.getFullYear()}-${String(invoice.issueDate.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + Number(invoice.amountReceived));
    });

    return Array.from(map.entries()).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue * 100) / 100,
    }));
  }
}

