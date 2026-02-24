import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AccountingService } from './accounting.service';

@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('overview')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT)
  overview() {
    return this.accountingService.overview();
  }

  @Get('monthly-revenue')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT)
  monthlyRevenue(@Query('year') year?: string) {
    const parsed = year ? Number(year) : new Date().getFullYear();
    return this.accountingService.monthlyRevenue(Number.isFinite(parsed) ? parsed : new Date().getFullYear());
  }
}

