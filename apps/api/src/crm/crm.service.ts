import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, Prisma } from '@digital-dhuriya/database';

@Injectable()
export class CrmService {
    constructor(private prisma: PrismaService) { }

    async createClient(data: Prisma.ClientCreateInput): Promise<Client> {
        return this.prisma.client.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.client.findMany({
            include: {
                contacts: true,
                projects: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.client.findUnique({
            where: { id },
            include: {
                contacts: true,
                projects: true,
                payments: true,
                followups: true,
            },
        });
    }

    async updateClient(id: string, data: Prisma.ClientUpdateInput) {
        return this.prisma.client.update({
            where: { id },
            data,
        });
    }

    async removeClient(id: string) {
        return this.prisma.client.delete({
            where: { id },
        });
    }
}
