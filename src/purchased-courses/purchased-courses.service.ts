import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreatePurchaseCourseDto,
  PurchaseCourseDto,
} from './dto/purchase-course.dto';
import { TAuthUser, UserRole } from '../types/user';
import { FetchPurchasedCoursesDto } from './dto/fetch-purchased-courses.dto';
import { PromiseManyData } from '../types/common/data-response';
import { Course, PaidVia, PaymentStatus, PurchasedCourse } from '@prisma/client';
import { FetchCourseStudentsDto } from './dto/fetch-course-students.dto';
import { FetchPaymentsDto } from './dto/fetch-payments.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class PurchasedCoursesService {
  constructor(private prisma: PrismaService) { }

  async getMyCourses(
    query: FetchPurchasedCoursesDto,
    authUser: TAuthUser,
  ): PromiseManyData<Pick<Course, 'id' | 'name' | 'banner' | 'level'>> {
    const pquery = {
      where: {
        purchases: {
          some: {
            userId: authUser.id,
            status: PaymentStatus.COMPLETED,
          },
        },
      },
    };
    if (query.search) {
      Object.assign(pquery.where, {
        name: {
          search: query.search.replace(/\s/g, ' | '),
        },
      });
    }
    if (query.category_id) {
      Object.assign(pquery.where, {
        categoryId: +query.category_id,
      });
    }
    if (query.level) {
      Object.assign(pquery.where, {
        level: query.level,
      });
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        ...pquery,
        skip: +query?.offset || 0,
        take: +query?.limit || 8,
        select: {
          id: true,
          name: true,
          banner: true,
          level: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.course.count(pquery),
    ]);
    return { total, data };
  }

  async getMyCourse(id: string, authUser: TAuthUser) {
    const purchasedCourse = await this.prisma.purchasedCourse.findFirst({
      where: {
        courseId: id,
        userId: authUser.id,
      },
      select: {
        purchasedAt: true,
        amount: true,
        paidVia: true,
        course: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            mentor: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
      },
    });
    if (!purchasedCourse) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    return purchasedCourse;
  }

  async getCourseStudents(
    courseId: string,
    query: FetchCourseStudentsDto,
    authUser: TAuthUser,
  ): PromiseManyData<
    Pick<PurchasedCourse, 'amount' | 'paidVia' | 'purchasedAt'>
  > {
    const pquery = {
      where: {
        courseId,
      },
    };
    if (query?.search) {
      Object.assign(pquery.where, {
        user: {
          fullName: {
            search: query.search.replace(/\s/g, ' | '),
          },
        },
      });
    }
    if (authUser.role === UserRole.MENTOR) {
      Object.assign(pquery.where, {
        course: {
          mentorId: authUser.id,
        },
      });
    }
    const [total, data] = await this.prisma.$transaction([
      this.prisma.purchasedCourse.count(pquery),
      this.prisma.purchasedCourse.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        select: {
          amount: true,
          paidVia: true,
          purchasedAt: true,
          user: {
            select: {
              id: true,
              fullName: true,
              image: true,
              phone: true,
            },
          },
        },
      }),
    ]);
    return { total, data };
  }

  async getPayments(query: FetchPaymentsDto): PromiseManyData<Pick<PurchasedCourse, 'amount' | 'status' | 'purchasedAt'>> {
    const pquery = {
      where: {},
    };
    if (query?.search) {
      Object.assign(pquery.where, {
        user: {
          fullName: {
            search: query.search.replace(/\s/g, ' | '),
          },
        },
      });
    }
    if (query?.status) {
      Object.assign(pquery.where, {
        status: query.status,
      });
    }
    const [total, data] = await this.prisma.$transaction([
      this.prisma.purchasedCourse.count(pquery),
      this.prisma.purchasedCourse.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        select: {
          amount: true,
          status: true,
          purchasedAt: true,
          user: {
            select: {
              id: true,
              fullName: true,
              image: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { status: 'asc' },
          { purchasedAt: 'desc' },
        ],
      }),
    ]);
    return { total, data };
  }

  async checkCoursePurchased(courseId: string, userId: number) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
        published: true,
      },
    });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    const purchased = await this.prisma.purchasedCourse.findFirst({
      where: {
        courseId: courseId,
        userId: userId,
      },
    });
    if (purchased) {
      throw new HttpException(
        'This course already purchased',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { purchased, course };
  }

  async purchaseCourse(payload: PurchaseCourseDto, authUser: TAuthUser) {
    const { course } = await this.checkCoursePurchased(
      payload.courseId,
      authUser.id,
    );
    return this.prisma.purchasedCourse.create({
      data: {
        courseId: payload.courseId,
        userId: authUser.id,
        amount: course.price,
        paidVia: PaidVia.PAYME,
      },
    });
  }

  async createPurchasedCourse(payload: CreatePurchaseCourseDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone: payload.phone,
        role: UserRole.STUDENT,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { course } = await this.checkCoursePurchased(
      payload.courseId,
      user.id,
    );
    return this.prisma.purchasedCourse.create({
      data: {
        courseId: course.id,
        userId: user.id,
        amount: course.price,
        paidVia: PaidVia.CASH,
      },
    });
  }

  async updateStatus(courseId: string, userId: number) {
    const purchased = await this.prisma.purchasedCourse.findFirst({
      where: {
        courseId: courseId,
        userId: userId,
      },
    });
    if (!purchased) {
      throw new HttpException(
        'This course has not purchased',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (purchased.status === PaymentStatus.PENDING) {
      await this.prisma.purchasedCourse.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: { status: PaymentStatus.COMPLETED },
      });

      return {
        message: `Status has successfully changed to Completed`
      }
    }

    await this.prisma.purchasedCourse.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: { status: PaymentStatus.PENDING },
    });

    return {
      message: `Status has successfully changed to Pending`
    }
  }
}