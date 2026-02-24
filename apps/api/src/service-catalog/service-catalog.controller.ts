import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceCatalogService } from './service-catalog.service';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceCatalogController {
  constructor(private readonly serviceCatalogService: ServiceCatalogService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: CreateServiceDto) {
    return this.serviceCatalogService.create(dto);
  }

  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.ACCOUNTANT,
    Role.FREELANCER,
  )
  findAll() {
    return this.serviceCatalogService.findAll();
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
    return this.serviceCatalogService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.serviceCatalogService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.serviceCatalogService.remove(id);
  }
}

