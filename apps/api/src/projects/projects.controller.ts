import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    create(@Body() createProjectDto: any) {
        return this.projectsService.createProject(createProjectDto);
    }

    @Get()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES, Role.FREELANCER)
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SALES, Role.FREELANCER)
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    update(@Param('id') id: string, @Body() updateProjectDto: any) {
        return this.projectsService.updateProject(id, updateProjectDto);
    }

    @Delete(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.projectsService.removeProject(id);
    }

    @Post(':id/tasks')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.FREELANCER)
    createTask(@Param('id') projectId: string, @Body() data: any) {
        return this.projectsService.createTask({
            ...data,
            project: { connect: { id: projectId } },
        });
    }
}
