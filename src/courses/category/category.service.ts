import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourseCategoryDto } from './dto/create.dto';
import { PaginationDto } from '../../global/dto/pagination.dto';
import { UpdateCourseCategoryDto } from './dto/update.dto';
import { PromiseManyData } from '../../types/common/data-response';
import { CourseCategory } from '@prisma/client';

@Injectable()
export class CourseCategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll(
    pagination: PaginationDto,
  ): PromiseManyData<Omit<CourseCategory, 'createdAt'>> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.courseCategory.findMany({
        select: {
          id: true,
          name: true,
        },
        skip: +pagination?.offset || 0,
        take: +pagination?.limit || 8,
      }),
      this.prisma.courseCategory.count(),
    ]);
    return { total, data };
  }

  async getSingle(id: number, count?: boolean) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id },
      include: count
        ? {
            _count: {
              select: {
                courses: true,
              },
            },
          }
        : undefined,
    });
    if (!category) {
      throw new HttpException('Category not found!', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  createCategory(payload: CreateCourseCategoryDto) {
    return this.prisma.courseCategory.create({
      data: {
        name: payload.name,
      },
    });
  }

  async updateCategory(id: number, payload: UpdateCourseCategoryDto) {
    await this.getSingle(id);
    return this.prisma.courseCategory.update({
      where: { id },
      data: {
        name: payload.name,
      },
    });
  }

  async deleteCategory(id: number) {
    const category = await this.getSingle(id, true);
    if (category._count.courses) {
      throw new BadRequestException(
        `There are ${category._count.courses} courses in this category, therefore you cannot delete course category. Please change those courses' categories to delete this category.`,
      );
    }
    await this.prisma.courseCategory.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Category deleted',
    };
  }
}
