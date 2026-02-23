import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@digital-dhuriya/database';

@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HrController {
    constructor(private readonly hrService: HrService) { }

    @Get('employees')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.HR)
    findAllEmployees() {
        return this.hrService.findAllEmployees();
    }

    @Post('attendance')
    @Roles(Role.SUPER_ADMIN, Role.HR)
    recordAttendance(@Body() data: any) {
        return this.hrService.recordAttendance(data);
    }

    @Patch('salary/:userId')
    @Roles(Role.SUPER_ADMIN, Role.HR, Role.ACCOUNTS)
    updateSalary(@Param('userId') userId: string, @Body('amount') amount: number) {
        return this.hrService.updateSalary(userId, amount);
    }

    @Post('performance')
    @Roles(Role.SUPER_ADMIN, Role.HR)
    addPerformance(@Body() data: any) {
        return this.hrService.addPerformanceScore(data);
    }
}
