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
import { QuotationStatus, Role } from '@digital-dhuriya/database';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QuotationsService } from './quotations.service';

@Controller('quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  create(@Body() dto: CreateQuotationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.quotationsService.create(dto, user.userId);
  }

  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.ACCOUNTANT,
  )
  findAll(@Query('status') status?: QuotationStatus) {
    return this.quotationsService.findAll(status);
  }

  @Get(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.ACCOUNTANT,
    Role.FREELANCER,
  )
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(id);
  }

  @Get(':id/pdf')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.ACCOUNTANT)
  async pdf(@Param('id') id: string, @Res() response: Response) {
    const buffer = await this.quotationsService.generatePdf(id);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="quotation-${id}.pdf"`);
    response.send(buffer);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.quotationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(id);
  }
}

