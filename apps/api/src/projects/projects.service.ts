import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project, Task, Prisma } from '@digital-dhuriya/database';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
        return this.prisma.project.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.project.findMany({
            include: {
                client: true,
                team: true,
                tasks: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.project.findUnique({
            where: { id },
            include: {
                client: true,
                team: true,
                tasks: {
                    include: {
                        comments: true,
                    },
                },
                files: true,
            },
        });
    }

    async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
        return this.prisma.project.update({
            where: { id },
            data,
        });
    }

    async removeProject(id: string) {
        return this.prisma.project.delete({
            where: { id },
        });
    }

    async createTask(data: Prisma.TaskCreateInput) {
        return this.prisma.task.create({
            data,
        });
    }

    async updateTask(id: string, data: Prisma.TaskUpdateInput) {
        return this.prisma.task.update({
            where: { id },
            data,
        });
    }
}
