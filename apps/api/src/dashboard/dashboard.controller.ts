import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
    Role.ACCOUNTANT,
  )
  summary() {
    return this.dashboardService.getSummary();
  }

  @Get('revenue-trend')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.ACCOUNTANT,
  )
  revenueTrend(@Query('months') months?: string) {
    const parsed = months ? Number(months) : 6;
    return this.dashboardService.getRevenueTrend(Number.isFinite(parsed) ? parsed : 6);
  }
}

