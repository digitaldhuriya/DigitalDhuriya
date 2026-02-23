import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post('leads')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES)
    create(@Body() createLeadDto: any) {
        return this.salesService.createLead(createLeadDto);
    }

    @Get('leads')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES)
    findAll() {
        return this.salesService.findAll();
    }

    @Get('leads/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES)
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }

    @Patch('leads/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES)
    update(@Param('id') id: string, @Body() updateLeadDto: any) {
        return this.salesService.updateLead(id, updateLeadDto);
    }

    @Delete('leads/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.salesService.removeLead(id);
    }

    @Post('commissions')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    createCommission(@Body() data: any) {
        return this.salesService.createCommission(data);
    }
}
