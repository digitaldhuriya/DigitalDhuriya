import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus } from '@digital-dhuriya/database';
import { slugifyTitle } from '../common/utils/slug.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private async uniqueSlugFromTitle(title: string, currentId?: string) {
    const base = slugifyTitle(title);
    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.blogPost.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || existing.id === currentId) {
        return slug;
      }

      counter += 1;
      slug = `${base}-${counter}`;
    }
  }

  async create(dto: CreateBlogPostDto, userId: string) {
    const slug = await this.uniqueSlugFromTitle(dto.title);

    return this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        coverImage: dto.coverImage,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        status: dto.status ?? BlogStatus.DRAFT,
        publishedAt: (dto.status ?? BlogStatus.DRAFT) === BlogStatus.PUBLISHED ? new Date() : null,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  findAll(status?: BlogStatus) {
    return this.prisma.blogPost.findMany({
      where: status ? { status } : undefined,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.findOne(id);

    const slug = dto.title
      ? await this.uniqueSlugFromTitle(dto.title, existing.id)
      : existing.slug;

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        coverImage: dto.coverImage,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        status: dto.status,
        publishedAt:
          dto.status === BlogStatus.PUBLISHED
            ? existing.publishedAt || new Date()
            : dto.status === BlogStatus.DRAFT
              ? null
              : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Blog post deleted successfully' };
  }
}

