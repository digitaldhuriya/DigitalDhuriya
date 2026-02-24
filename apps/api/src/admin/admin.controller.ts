import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(Role.SUPER_ADMIN)
  users() {
    return this.adminService.listUsers();
  }

  @Post('users')
  @Roles(Role.SUPER_ADMIN)
  createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Patch('users/:id/status')
  @Roles(Role.SUPER_ADMIN)
  updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Get('backups')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT)
  backups() {
    return this.adminService.listBackups();
  }

  @Post('backups')
  @Roles(Role.SUPER_ADMIN)
  createBackup(@CurrentUser() user: AuthenticatedUser) {
    return this.adminService.createBackup(user.userId);
  }
}

