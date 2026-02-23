import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Attendance, Salary, Performance, Prisma } from '@prisma/client';

@Injectable()
export class HrService {
    constructor(private prisma: PrismaService) { }

    async findAllEmployees() {
        return this.prisma.user.findMany({
            include: {
                attendance: true,
                salary: true,
                performance: true,
            },
        });
    }

    async recordAttendance(data: Prisma.AttendanceCreateInput) {
        return this.prisma.attendance.create({
            data,
        });
    }

    async getAttendance(userId: string) {
        return this.prisma.attendance.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }

    async updateSalary(userId: string, amount: number) {
        return this.prisma.salary.upsert({
            where: { userId },
            update: { amount },
            create: { userId, amount },
        });
    }

    async addPerformanceScore(data: Prisma.PerformanceCreateInput) {
        return this.prisma.performance.create({
            data,
        });
    }
}
