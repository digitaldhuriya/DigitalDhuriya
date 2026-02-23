import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign, Prisma } from '@prisma/client';

@Injectable()
export class MarketingService {
    constructor(private prisma: PrismaService) { }

    async createCampaign(data: Prisma.CampaignCreateInput) {
        return this.prisma.campaign.create({
            data,
        });
    }

    async findAllCampaigns() {
        return this.prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateCampaign(id: string, data: Prisma.CampaignUpdateInput) {
        return this.prisma.campaign.update({
            where: { id },
            data,
        });
    }
}
