import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('marketing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingController {
    constructor(private readonly marketingService: MarketingService) { }

    @Post('campaigns')
    @Roles(Role.SUPER_ADMIN, Role.MARKETING)
    create(@Body() data: any) {
        return this.marketingService.createCampaign(data);
    }

    @Get('campaigns')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MARKETING)
    findAll() {
        return this.marketingService.findAllCampaigns();
    }

    @Patch('campaigns/:id')
    @Roles(Role.SUPER_ADMIN, Role.MARKETING)
    update(@Param('id') id: string, @Body() data: any) {
        return this.marketingService.updateCampaign(id, data);
    }
}
