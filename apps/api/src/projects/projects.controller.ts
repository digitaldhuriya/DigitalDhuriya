import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@digital-dhuriya/database';
import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { safeFileName } from '../common/utils/file.util';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
    Role.ACCOUNTANT,
  )
  findAll(@Query('status') status?: string) {
    return this.projectsService.findAll(status);
  }

  @Get(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
    Role.ACCOUNTANT,
  )
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/tasks')
  @Roles(Role.SUPER_ADMIN, Role.SALES_MANAGER, Role.DIGITAL_MARKETING_EXECUTIVE)
  createTask(
    @Param('id') projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.createTask(projectId, dto, user.userId);
  }

  @Patch('tasks/:taskId')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
  )
  updateTask(@Param('taskId') taskId: string, @Body() dto: UpdateTaskDto) {
    return this.projectsService.updateTask(taskId, dto);
  }

  @Post(':id/files')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
  )
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadDir = join(process.cwd(), 'uploads', 'projects');
          mkdirSync(uploadDir, { recursive: true });
          callback(null, uploadDir);
        },
        filename: (_req, file, callback) => {
          callback(null, safeFileName(file.originalname));
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'image/png',
          'image/jpeg',
          'image/webp',
          'application/zip',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          callback(new BadRequestException('Unsupported file type'), false);
          return;
        }

        callback(null, true);
      },
    }),
  )
  uploadFile(
    @Param('id') projectId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.projectsService.uploadFile(
      projectId,
      {
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
      user.userId,
    );
  }
}

