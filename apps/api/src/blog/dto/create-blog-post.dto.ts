import { BlogStatus } from '@digital-dhuriya/database';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}

