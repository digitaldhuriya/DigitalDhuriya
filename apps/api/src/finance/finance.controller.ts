import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@digital-dhuriya/database';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Post('transactions')
    @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
    createTransaction(@Body() data: any) {
        return this.financeService.createTransaction(data);
    }

    @Get('transactions')
    @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
    findAllTransactions() {
        return this.financeService.findAllTransactions();
    }

    @Post('invoices')
    @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
    createInvoice(@Body() data: any) {
        return this.financeService.createInvoice(data);
    }

    @Get('invoices')
    @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
    findAllInvoices() {
        return this.financeService.findAllInvoices();
    }

    @Get('stats')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTS)
    getStats() {
        return this.financeService.getMonthlyStats();
    }
}
