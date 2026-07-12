import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLessonGroupDto } from './dto/create.dto';
import { UpdateLessonGroupDto } from './dto/update.dto';
import { PromiseManyData } from '../../types/common/data-response';
import { LessonGroup } from '@prisma/client';
import { TAuthUser, UserRole } from '../../types/user';
import { FetchGroupsDto } from './dto/fetch-groups.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class LessonGroupService {
  constructor(private prisma: PrismaService) {}

  async getAll(
    courseId: string,
    query: FetchGroupsDto,
    authUser?: TAuthUser,
  ): PromiseManyData<Omit<LessonGroup, 'createdAt' | 'courseId'>> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.lessonGroup.findMany({
        where: { courseId },
        select: {
          id: true,
          name: true,
          lessons:
            query?.include_lessons === 'true'
              ? {
                  select: {
                    id: true,
                    name: true,
                    views: authUser
                      ? {
                          where: {
                            userId: authUser.id,
                          },
                          select: {
                            view: true,
                          },
                        }
                      : undefined,
                  },
                }
              : false,
        },
        skip: +query?.offset || 0,
        take: +query?.limit || 8,
      }),
      this.prisma.lessonGroup.count({
        where: {
          courseId,
        },
      }),
    ]);
    return { total, data };
  }

  async getSingle(id: number, authUser: TAuthUser) {
    const args = {
      where: { id },
      select: {
        id: true,
        lessons: true
      }
    };
    if (authUser.role === UserRole.MENTOR) {
      Object.assign(args.where, {
        course: {
          mentorId: authUser.id,
        },
      });
    }
    const group = await this.prisma.lessonGroup.findUnique(args);
    if (!group) {
      throw new HttpException('Lesson Group not found', HttpStatus.NOT_FOUND);
    }
    return group;
  }

  async createLessonGroup(payload: CreateLessonGroupDto, authUser: TAuthUser) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: payload.courseId,
        mentorId: authUser.role === UserRole.MENTOR ? authUser.id : undefined,
      },
    });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.lessonGroup.create({
      data: {
        name: payload.name,
        courseId: payload.courseId,
      },
    });
  }

  async updateLessonGroup(
    id: number,
    payload: UpdateLessonGroupDto,
    authUser: TAuthUser,
  ) {
    await this.getSingle(id, authUser);
    return this.prisma.lessonGroup.update({
      where: {
        id,
      },
      data: {
        name: payload.name,
      },
    });
  }

  async deleteCategory(id: number, authUser: TAuthUser) {
    await this.getSingle(id, authUser);
    await this.prisma.lessonGroup.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Category deleted',
    };
  }
}
