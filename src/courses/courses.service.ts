import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { TAuthUser, UserRole } from '../types/user';
import { FilesService } from '../files/files.service';
import { EFileType } from '../types/files';
import { FetchCoursesDto, FetchUserCourses } from './dto/fetch-courses.dto';
import { PromiseManyData } from '../types/common/data-response';
import { AssignedCourse, Course } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseMentorDto } from './dto/update-course-mentor.dto';
import { AssignCourseDto } from './dto/assign-course.dto';
import { PaginationDto } from '../global/dto/pagination.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  private selectManyCourse = {
    id: true,
    name: true,
    banner: true,
    level: true,
    price: true,
    createdAt: true,
    category: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  private generateCourseQuery(query: FetchUserCourses) {
    const pquery = {
      where: {},
    };
    if (query?.search) {
      Object.assign(pquery.where, {
        name: {
          search: query?.search.replace(/\s/g, ' | '),
        },
      });
    }
    if (query?.level) {
      Object.assign(pquery.where, {
        level: query?.level,
      });
    }
    if (query?.category_id) {
      Object.assign(pquery.where, {
        categoryId: +query?.category_id,
      });
    }
    if (query?.published) {
      Object.assign(pquery.where, {
        published: query.published === 'true',
      });
    }
    if (query?.mentor_id) {
      Object.assign(pquery.where, {
        mentorId: +query.mentor_id,
      });
    }
    if (query?.price_min || query?.price_max) {
      Object.assign(pquery.where, {
        price: {
          gte: +query?.price_min || undefined,
          lte: +query?.price_max || undefined,
        },
      });
    }
    return pquery;
  }

  async getCourses(
    query: FetchCoursesDto,
  ): PromiseManyData<
    Pick<Course, 'id' | 'name' | 'banner' | 'level' | 'price' | 'createdAt'>
  > {
    const pquery = this.generateCourseQuery({ ...query, published: 'true' });
    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        select: {
          ...this.selectManyCourse,
          mentor: {
            select: {
              id: true,
              image: true,
              fullName: true,
            },
          },
          _count: {
            select: {
              purchases: true,
            },
          },
        },
      }),
      this.prisma.course.count(pquery),
    ]);
    return { total, data };
  }

  async getCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id, published: true, },
      select: {
        ...this.selectManyCourse,
        about: true,
        introVideo: true,
        mentor: {
          select: {
            id: true,
            fullName: true,
            image: true,
            mentorProfile: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    return course;
  }

  async getUserCourses(
    query: FetchUserCourses,
    userId: number,
    mine?: boolean,
  ): PromiseManyData<
    Pick<
      Course,
      'id' | 'name' | 'banner' | 'level' | 'price' | 'published' | 'createdAt'
    >
  > {
    if (!mine) {
      const mentor = await this.prisma.user.findUnique({
        where: {
          id: userId,
          role: {
            in: [UserRole.MENTOR, UserRole.ADMIN],
          },
        },
      });
      if (!mentor) {
        throw new NotFoundException('Mentor not found');
      }
    }
    const pquery = this.generateCourseQuery(query);
    Object.assign(pquery.where, {
      mentorId: userId,
    });
    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        select: {
          ...this.selectManyCourse,
          published: true,
          createdAt: true,
          _count: {
            select: {
              purchases: true,
              rates: true,
            },
          },
        },
      }),
      this.prisma.course.count(pquery),
    ]);
    return { total, data };
  }

  async createCourse(payload: CreateCourseDto, authUser: TAuthUser) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id: +payload.categoryId },
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    payload.banner = await this.filesService.saveFile(
      payload.banner as Express.Multer.File,
      EFileType.PUBLIC_FILE,
    );
    if (payload.introVideo) {
      payload.introVideo = await this.filesService.saveFile(
        payload.introVideo as Express.Multer.File,
        EFileType.PUBLIC_FILE,
      );
    }
    return this.prisma.course.create({
      data: {
        name: payload.name,
        about: payload.about,
        price: +payload.price,
        level: payload.level,
        categoryId: +payload.categoryId,
        mentorId: authUser.id,
        banner: payload.banner,
        introVideo: payload.introVideo,
      },
    });
  }

  async updateCourse(
    id: string,
    payload: UpdateCourseDto,
    authUser: TAuthUser,
  ) {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });
    if (
      !course ||
      (authUser.role === UserRole.MENTOR && authUser.id !== course?.mentorId)
    ) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    if (payload?.categoryId) {
      const category = await this.prisma.courseCategory.findUnique({
        where: { id: +payload.categoryId },
      });
      if (!category) {
        throw new HttpException(
          'Course Category not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (payload?.banner) {
      this.filesService.deleteFile(course.banner, EFileType.PUBLIC_FILE);
      payload.banner = await this.filesService.saveFile(
        payload.banner,
        EFileType.PUBLIC_FILE,
      );
    }
    if (payload?.introVideo) {
      this.filesService.deleteFile(course.introVideo, EFileType.PUBLIC_FILE);
      payload.introVideo = await this.filesService.saveFile(
        payload.introVideo,
        EFileType.PUBLIC_FILE,
      );
    }
    return this.prisma.course.update({
      where: { id },
      data: {
        name: payload?.name || course.name,
        about: payload?.about || course.about,
        price: +payload?.price || course.price,
        level: payload?.level || course.level,
        categoryId: +payload?.categoryId || course.categoryId,
        banner: payload?.banner || course.banner,
        introVideo: payload?.introVideo || course.introVideo,
        updatedAt: new Date(),
      },
    });
  }

  private async getSingle(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    return course;
  }

  async changeCoursePublished(id: string, published: boolean) {
    await this.getSingle(id);
    await this.prisma.course.update({
      where: { id },
      data: {
        published,
      },
    });
    return {
      success: true,
      message: 'Course ' + (published ? 'published' : 'unpublished'),
    };
  }

  async updateCourseMentor(payload: UpdateCourseMentorDto) {
    await this.getSingle(payload.courseId);
    const mentor = await this.prisma.user.findUnique({
      where: { id: payload.userId, role: UserRole.MENTOR },
    });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    await this.prisma.course.update({
      where: { id: payload.courseId },
      data: {
        mentorId: payload.userId,
        updatedAt: new Date(),
      },
    });
    return { success: true, message: 'Course mentor updated' };
  }

  async getMyAssignedCourses(
    query: FetchUserCourses,
    authUser: TAuthUser,
  ): PromiseManyData<
    Pick<
      Course,
      'id' | 'name' | 'banner' | 'level' | 'price' | 'published' | 'createdAt'
    >
  > {
    const pquery = this.generateCourseQuery(query);
    Object.assign(pquery.where, {
      assistants: {
        some: {
          userId: authUser.id,
        },
      },
    });
    const [total, data] = await this.prisma.$transaction([
      this.prisma.course.count(pquery),
      this.prisma.course.findMany({
        ...pquery,
        skip: +query?.offset || 0,
        take: +query?.limit || 8,
        select: {
          ...this.selectManyCourse,
          published: true,
          mentor: {
            select: {
              id: true,
              fullName: true,
              image: true,
            },
          },
        },
      }),
    ]);
    return { total, data };
  }

  private async getMentorCourse(id: string, authUser: TAuthUser) {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
        mentorId: authUser.role === UserRole.MENTOR ? authUser.id : undefined,
      },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  }

  async getCourseAssistants(
    id: string,
    query: PaginationDto,
    authUser: TAuthUser,
  ): PromiseManyData<Pick<AssignedCourse, 'createdAt'>> {
    await this.getMentorCourse(id, authUser);
    const where = { courseId: id };
    const [total, data] = await this.prisma.$transaction([
      this.prisma.assignedCourse.count({ where }),
      this.prisma.assignedCourse.findMany({
        where,
        skip: +query?.offset || 0,
        take: +query?.limit || 8,
        select: {
          createdAt: true,
          user: {
            select: {
              id: true,
              phone: true,
              fullName: true,
              image: true,
            },
          },
        },
      }),
    ]);
    return { total, data };
  }

  async assignCourse(payload: AssignCourseDto, authUser: TAuthUser) {
    await this.getMentorCourse(payload.courseId, authUser);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.assistantId, role: UserRole.ASSISTANT },
      include: {
        _count: {
          select: {
            assignedCourses: {
              where: { courseId: payload.courseId },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Assistant not found');
    }
    if (user._count.assignedCourses) {
      throw new BadRequestException(
        'This course already assigned to assistant',
      );
    }
    return this.prisma.assignedCourse.create({
      data: {
        courseId: payload.courseId,
        userId: payload.assistantId,
      },
    });
  }

  async deleteAssignedCourse(payload: AssignCourseDto, authUser: TAuthUser) {
    const assignedCourse = await this.prisma.assignedCourse.findFirst({
      where: {
        userId: payload.assistantId,
        course: {
          id: payload.courseId,
          mentorId: authUser.role === UserRole.MENTOR ? authUser.id : undefined,
        },
      },
    });
    if (!assignedCourse) {
      throw new NotFoundException('Assigned Course not found');
    }
    await this.prisma.assignedCourse.delete({
      where: {
        userId_courseId: {
          courseId: payload.courseId,
          userId: payload.assistantId,
        },
      },
    });
    return {
      success: true,
      message: 'Assigned Course deleted',
    };
  }

  async deleteCourse(id: string, authUser: TAuthUser) {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
        mentorId: authUser.role === UserRole.MENTOR ? authUser.id : undefined,
      },
      include: {
        _count: {
          select: {
            purchases: true,
            lessonGroups: true,
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.published) {
      throw new BadRequestException('You cannot delete published course');
    }
    if (course._count.purchases) {
      throw new BadRequestException(
        'You cannot delete course when it has purchases',
      );
    }
    if (course._count.lessonGroups) {
      throw new BadRequestException(
        'You cannot delete course when it has Lesson Groups',
      );
    }

    this.filesService.deleteFile(course.banner, EFileType.PUBLIC_FILE);

    if (course.introVideo) {
      this.filesService.deleteFile(course.introVideo, EFileType.PUBLIC_FILE);
    }
    await this.prisma.course.delete({
      where: { id },
    });
    return { success: true, message: 'Course deleted' };
  }
}
