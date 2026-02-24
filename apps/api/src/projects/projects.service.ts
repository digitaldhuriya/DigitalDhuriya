import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProjectStatus } from '@digital-dhuriya/database';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const projectInclude = {
  client: {
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
    },
  },
  members: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  },
  tasks: {
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  },
  files: {
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private toDate(value?: string): Date | undefined {
    return value ? new Date(value) : undefined;
  }

  async create(dto: CreateProjectDto) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: dto.name,
          description: dto.description,
          clientId: dto.clientId,
          status: dto.status,
          priority: dto.priority,
          startDate: this.toDate(dto.startDate),
          deadline: this.toDate(dto.deadline),
        },
      });

      if (dto.teamMemberIds?.length) {
        await tx.projectMember.createMany({
          data: dto.teamMemberIds.map((userId) => ({
            projectId: project.id,
            userId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.project.findUnique({
        where: { id: project.id },
        include: projectInclude,
      });
    });
  }

  findAll(status?: string) {
    return this.prisma.project.findMany({
      where: status ? { status: status as ProjectStatus } : undefined,
      include: projectInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: projectInclude,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          clientId: dto.clientId,
          status: dto.status,
          priority: dto.priority,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          deadline: dto.deadline ? new Date(dto.deadline) : undefined,
          completedAt: dto.status === 'COMPLETED' ? new Date() : undefined,
        },
      });

      if (dto.teamMemberIds) {
        await tx.projectMember.deleteMany({ where: { projectId: id } });

        if (dto.teamMemberIds.length) {
          await tx.projectMember.createMany({
            data: dto.teamMemberIds.map((userId) => ({ projectId: id, userId })),
          });
        }
      }

      return tx.project.findUnique({
        where: { id },
        include: projectInclude,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Project deleted successfully' };
  }

  async createTask(projectId: string, dto: CreateTaskDto, userId: string) {
    await this.findOne(projectId);

    return this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignedToId: dto.assignedToId,
        createdById: userId,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async updateTask(taskId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignedToId: dto.assignedToId,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async uploadFile(
    projectId: string,
    file: { filename: string; path: string; mimetype: string; size: number },
    userId: string,
  ) {
    await this.findOne(projectId);

    return this.prisma.projectFile.create({
      data: {
        projectId,
        uploadedById: userId,
        fileName: file.filename,
        filePath: file.path.replace(/\\/g, '/'),
        mimeType: file.mimetype,
        fileSize: file.size,
      },
    });
  }
}

