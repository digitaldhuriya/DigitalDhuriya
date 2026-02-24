import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { CommissionStatus, Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CommissionsService } from './commissions.service';
import { MarkCommissionPaidDto } from './mark-commission-paid.dto';

@Controller('commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT, Role.SALES_MANAGER)
  findAll(
    @Query('status') status?: CommissionStatus,
    @Query('salesPersonId') salesPersonId?: string,
  ) {
    return this.commissionsService.findAll({ status, salesPersonId });
  }

  @Get('summary')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT)
  summary() {
    return this.commissionsService.summary();
  }

  @Patch(':id/pay')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT)
  markPaid(@Param('id') id: string, @Body() dto: MarkCommissionPaidDto) {
    return this.commissionsService.markPaid(id, dto);
  }
}

