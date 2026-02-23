import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('crm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CrmController {
    constructor(private readonly crmService: CrmService) { }

    @Post('clients')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES)
    create(@Body() createClientDto: any) {
        return this.crmService.createClient(createClientDto);
    }

    @Get('clients')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES, Role.MARKETING)
    findAll() {
        return this.crmService.findAll();
    }

    @Get('clients/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES, Role.MARKETING)
    findOne(@Param('id') id: string) {
        return this.crmService.findOne(id);
    }

    @Patch('clients/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES)
    update(@Param('id') id: string, @Body() updateClientDto: any) {
        return this.crmService.updateClient(id, updateClientDto);
    }

    @Delete('clients/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.crmService.removeClient(id);
    }
}
