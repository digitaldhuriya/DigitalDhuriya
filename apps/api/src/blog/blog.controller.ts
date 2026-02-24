import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogStatus, Role } from '@digital-dhuriya/database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Controller('blog')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('posts')
  @Roles(Role.SUPER_ADMIN, Role.DIGITAL_MARKETING_EXECUTIVE)
  create(@Body() dto: CreateBlogPostDto, @CurrentUser() user: AuthenticatedUser) {
    return this.blogService.create(dto, user.userId);
  }

  @Get('posts')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
    Role.ACCOUNTANT,
  )
  findAll(@Query('status') status?: BlogStatus) {
    return this.blogService.findAll(status);
  }

  @Get('posts/:id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.SALES_MANAGER,
    Role.DIGITAL_MARKETING_EXECUTIVE,
    Role.FREELANCER,
    Role.ACCOUNTANT,
  )
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch('posts/:id')
  @Roles(Role.SUPER_ADMIN, Role.DIGITAL_MARKETING_EXECUTIVE)
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @Delete('posts/:id')
  @Roles(Role.SUPER_ADMIN, Role.DIGITAL_MARKETING_EXECUTIVE)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}

