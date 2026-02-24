import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        commissionPercent: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role,
        commissionPercent: dto.commissionPercent ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        commissionPercent: true,
      },
    });
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: dto.isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        commissionPercent: true,
      },
    });
  }

  async createBackup(createdById: string) {
    const [
      users,
      leads,
      clients,
      projects,
      services,
      quotations,
      invoices,
      commissions,
      blogPosts,
      settings,
    ] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          commissionPercent: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.lead.findMany({ include: { leadNotes: true } }),
      this.prisma.client.findMany({ include: { activeServices: true } }),
      this.prisma.project.findMany({ include: { members: true, tasks: true, files: true } }),
      this.prisma.service.findMany(),
      this.prisma.quotation.findMany({ include: { items: true } }),
      this.prisma.invoice.findMany({ include: { items: true } }),
      this.prisma.commission.findMany(),
      this.prisma.blogPost.findMany(),
      this.prisma.setting.findUnique({ where: { id: 1 } }),
    ]);

    const payload = {
      generatedAt: new Date().toISOString(),
      users,
      leads,
      clients,
      projects,
      services,
      quotations,
      invoices,
      commissions,
      blogPosts,
      settings,
    };

    const backupsDir = join(process.cwd(), 'backups');
    await mkdir(backupsDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `digital-dhuriya-backup-${timestamp}.json`;
    const filePath = join(backupsDir, fileName);

    await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');

    const backupLog = await this.prisma.backupLog.create({
      data: {
        fileName,
        filePath,
        createdById,
      },
    });

    return {
      message: 'Backup created successfully',
      backup: backupLog,
    };
  }

  listBackups() {
    return this.prisma.backupLog.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

