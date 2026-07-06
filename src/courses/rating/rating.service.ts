import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RateCourseDto } from './dto/rate-course.dto';
import { TAuthUser } from '../../types/user';
import { PaginationDto } from '../../global/dto/pagination.dto';
import { PromiseManyData } from '../../types/common/data-response';
import { Rating } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CourseRatingService {
  constructor(private prisma: PrismaService) {}

  private async checkCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id, published: true },
    });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    return course;
  }

  async getCourseRates(
    id: string,
    query: PaginationDto,
  ): PromiseManyData<Omit<Rating, 'userId' | 'courseId'>> {
    await this.checkCourse(id);
    const pquery = {
      where: {
        courseId: id,
      },
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.rating.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        select: {
          id: true,
          rate: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              image: true,
              fullName: true,
            },
          },
        },
      }),
      this.prisma.rating.count(pquery),
    ]);
    return { data, total };
  }

  async getCourseRatingAnalytics(courseId: string) {
    await this.checkCourse(courseId);
    const transactions: any = [
      this.prisma.rating.aggregate({
        where: {
          courseId,
        },
        _avg: {
          rate: true,
        },
      }),
    ];
    for (let i = 1; i <= 5; i++) {
      transactions.push(
        this.prisma.rating.count({
          where: {
            courseId,
            rate: {
              equals: i,
            },
          },
        }),
      );
    }
    const [agg, one, two, three, four, five] = await this.prisma.$transaction(
      transactions,
    );
    return {
      rate: agg._avg.rate,
      one,
      two,
      three,
      four,
      five,
    };
  }

  async rateCourse(payload: RateCourseDto, authUser: TAuthUser) {
    const rated = await this.prisma.rating.findFirst({
      where: {
        courseId: payload.courseId,
        userId: authUser.id,
      },
    });
    if (rated) {
      throw new HttpException(
        'You already rated this course',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.prisma.rating.create({
      data: {
        courseId: payload.courseId,
        userId: authUser.id,
        rate: payload.rate,
        comment: payload.comment,
      },
    });
  }

  async deleteRating(id: number) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });
    if (!rating) {
      throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.rating.delete({ where: { id } });
    return {
      success: true,
      message: 'Rating deleted successfully',
    };
  }
}
