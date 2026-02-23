import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Lead, Prisma } from '@digital-dhuriya/database';

@Injectable()
export class SalesService {
    constructor(private prisma: PrismaService) { }

    async createLead(data: Prisma.LeadCreateInput): Promise<Lead> {
        return this.prisma.lead.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.lead.findMany({
            include: {
                salesExecutive: true,
                commissions: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.lead.findUnique({
            where: { id },
            include: {
                salesExecutive: true,
                commissions: true,
            },
        });
    }

    async updateLead(id: string, data: Prisma.LeadUpdateInput) {
        return this.prisma.lead.update({
            where: { id },
            data,
        });
    }

    async removeLead(id: string) {
        return this.prisma.lead.delete({
            where: { id },
        });
    }

    async createCommission(data: Prisma.CommissionCreateInput) {
        return this.prisma.commission.create({
            data,
        });
    }
}
