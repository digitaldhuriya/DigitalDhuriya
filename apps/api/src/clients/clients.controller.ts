import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AssignClientServicesDto } from './dto/assign-client-services.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.ACCOUNTANT,
  )
  findAll(@Query('search') search?: string) {
    return this.clientsService.findAll(search);
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
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Post(':id/services')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  assignServices(@Param('id') id: string, @Body() dto: AssignClientServicesDto) {
    return this.clientsService.assignServices(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}

