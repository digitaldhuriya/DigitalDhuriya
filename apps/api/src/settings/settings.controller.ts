import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
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
import { safeFileName } from '../common/utils/file.util';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTANT)
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @Roles(Role.SUPER_ADMIN)
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }

  @Post('logo')
  @Roles(Role.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadDir = join(process.cwd(), 'uploads', 'logos');
          mkdirSync(uploadDir, { recursive: true });
          callback(null, uploadDir);
        },
        filename: (_req, file, callback) => {
          callback(null, safeFileName(file.originalname));
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!allowed.includes(file.mimetype)) {
          callback(new BadRequestException('Only image files are allowed'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }

    const logoUrl = `/uploads/logos/${file.filename}`;
    const settings = await this.settingsService.updateLogo(logoUrl);
    return {
      logoUrl,
      settings,
    };
  }
}

