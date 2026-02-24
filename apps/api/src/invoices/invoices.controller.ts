import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InvoiceStatus, Role } from '@digital-dhuriya/database';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.ACCOUNTANT)
  create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.invoicesService.create(dto, user.userId);
  }

  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.ACCOUNTANT,
    Role.DIGITAL_MARKETING_EXECUTIVE,
  )
  findAll(@Query('status') status?: InvoiceStatus) {
    return this.invoicesService.findAll(status);
  }

  @Get(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.ACCOUNTANT,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
  )
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Get(':id/pdf')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.ACCOUNTANT)
  async pdf(@Param('id') id: string, @Res() response: Response) {
    const buffer = await this.invoicesService.generatePdf(id);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    response.send(buffer);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.ACCOUNTANT)
  update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, dto);
  }

  @Post(':id/payments')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT)
  recordPayment(@Param('id') id: string, @Body() dto: RecordPaymentDto) {
    return this.invoicesService.recordPayment(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}

