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
import { LeadStatus, Role } from '@digital-dhuriya/database';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateLeadNoteDto } from './dto/create-lead-note.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsService } from './leads.service';

@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.DIGITAL_MARKETING_EXECUTIVE)
  create(@Body() dto: CreateLeadDto, @CurrentUser() user: AuthenticatedUser) {
    return this.leadsService.create(dto, user.userId);
  }

  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.ACCOUNTANT,
  )
  findAll(
    @Query('status') status?: LeadStatus,
    @Query('search') search?: string,
  ) {
    return this.leadsService.findAll({ status, search });
  }

  @Get('export/csv')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.ACCOUNTANT)
  async exportCsv(
    @Res() response: Response,
    @Query('status') status?: LeadStatus,
    @Query('search') search?: string,
  ) {
    const csv = await this.leadsService.exportToCsv({ status, search });

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
    response.send(csv);
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
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Post(':id/notes')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.DIGITAL_MARKETING_EXECUTIVE)
  addNote(
    @Param('id') id: string,
    @Body() dto: CreateLeadNoteDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.leadsService.addNote(id, dto, user.userId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}

