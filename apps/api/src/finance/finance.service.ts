import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, Invoice, Prisma } from '@prisma/client';

@Injectable()
export class FinanceService {
    constructor(private prisma: PrismaService) { }

    async createTransaction(data: Prisma.TransactionCreateInput) {
        return this.prisma.transaction.create({
            data,
        });
    }

    async findAllTransactions() {
        return this.prisma.transaction.findMany({
            orderBy: { date: 'desc' },
        });
    }

    async createInvoice(data: Prisma.InvoiceCreateInput) {
        return this.prisma.invoice.create({
            data,
        });
    }

    async findAllInvoices() {
        return this.prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateInvoice(id: string, data: Prisma.InvoiceUpdateInput) {
        return this.prisma.invoice.update({
            where: { id },
            data,
        });
    }

    async getMonthlyStats() {
        // Basic aggregation for dashboard
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const income = await this.prisma.transaction.aggregate({
            where: { type: 'INCOME', date: { gte: startOfMonth } },
            _sum: { amount: true },
        });

        const expenses = await this.prisma.transaction.aggregate({
            where: { type: 'EXPENSE', date: { gte: startOfMonth } },
            _sum: { amount: true },
        });

        return {
            monthlyIncome: income._sum.amount || 0,
            monthlyExpenses: expenses._sum.amount || 0,
            profit: (income._sum.amount || 0) - (expenses._sum.amount || 0),
        };
    }
}
