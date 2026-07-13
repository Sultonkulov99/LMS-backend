import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { TAuthUser, UserRole } from '../types/user';
import { FilesService } from '../files/files.service';
import { EFileType } from '../types/files';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { PaginationDto } from '../global/dto/pagination.dto';
import { PromiseManyData } from '../types/common/data-response';
import {
  Homework,
  HomeworkSubmission,
  HomeworkSubStatus,
} from '@prisma/client';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { CheckHomeworkDto } from './dto/check-homework.dto';
import { FetchHomeworkSubmissionsDto } from './dto/fetch-homework-submissions.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) { }

  async getLessonHomeWorks(
    lessonId: string,
    query: PaginationDto,
    authUser: TAuthUser,
  ): PromiseManyData<Homework> {
    const mentorId =
      authUser.role === UserRole.MENTOR ? authUser.id : undefined;
    const assistants =
      authUser.role === UserRole.ASSISTANT
        ? {
          some: {
            userId: authUser.id,
          },
        }
        : undefined;
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    const pquery = {
      where: {
        lesson: {
          id: lessonId,
          mentorId,
          assistants,
        },
      },
    };
    
    const [total, data] = await this.prisma.$transaction([
      this.prisma.homework.count(pquery),
      this.prisma.homework.findMany({
        ...pquery,
        skip: +query?.offset || 0,
        take: +query?.limit || 8,
        include: {
          lesson: {
            select: {
              id: true,
              name: true,
              groupId: true,
            },
          },
        },
      }),
    ]);
    return { total, data };
  }

  async getDetailHomework(id: number, authUser: TAuthUser) {
    const homework = await this.prisma.homework.findUnique({
      where: {
        id,
        lesson: {
          group: {
            course: {
              mentorId:
                authUser.role === UserRole.MENTOR ? authUser.id : undefined,
              assistants:
                authUser.role === UserRole.ASSISTANT
                  ? {
                    some: {
                      userId: authUser.id,
                    },
                  }
                  : undefined,
            },
          },
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            name: true,
            groupId: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
    if (!homework) {
      throw new NotFoundException('Homework not found');
    }
    await this.getLesson(homework.lessonId, authUser);
    return homework;
  }

  private async getLesson(id: string, authUser: TAuthUser) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
        group:
          authUser.role === UserRole.MENTOR
            ? {
              course: {
                mentorId: authUser.id,
              },
            }
            : undefined,
      },
      include: {
        homework: true,
      },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async createHomework(payload: CreateHomeworkDto, authUser: TAuthUser) {
    const lesson = await this.getLesson(payload.lessonId, authUser);
    if (lesson.homework) {
      throw new BadRequestException('Lesson already has a homework');
    }
    const file = await this.filesService.saveFile(
      payload.file,
      EFileType.COURSE_CONTENT,
    );
    return this.prisma.homework.create({
      data: {
        lessonId: payload.lessonId,
        task: payload.task,
        file,
      },
    });
  }

  async updateHomework(
    id: number,
    payload: UpdateHomeworkDto,
    authUser: TAuthUser,
  ) {
    const homework = await this.getDetailHomework(id, authUser);
    if (payload?.file) {
      this.filesService.deleteFile(homework.file, EFileType.COURSE_CONTENT);
      payload.file = await this.filesService.saveFile(
        payload.file,
        EFileType.COURSE_CONTENT,
      );
    }
    return this.prisma.homework.update({
      where: { id },
      data: {
        task: payload?.task || homework.task,
        file: payload?.file || homework.file,
        updatedAt: new Date(),
      },
    });
  }

  async deleteHomework(id: number, authUser: TAuthUser) {
    await this.getDetailHomework(id, authUser);
    await this.prisma.homework.delete({
      where: { id },
    });
    return { success: true, message: 'Homework deleted' };
  }

  // Submissions
  async getMyHomeworkSubmissions(
    lessonId: string,
    query: PaginationDto,
    authUser: TAuthUser,
  ): PromiseManyData<HomeworkSubmission> {
    const pquery = {
      where: {
        userId: authUser.id,
        homework: {
          lessonId,
        },
      },
    };
    const [total, data] = await this.prisma.$transaction([
      this.prisma.homeworkSubmission.count(pquery),
      this.prisma.homeworkSubmission.findMany({
        ...pquery,
        orderBy: {
          createdAt: 'desc',
        },
        skip: +query?.offset || 0,
        take: +query?.limit || 8,
      }),
    ]);
    return { total, data };
  }

  async submitHomework(
    lessonId: string,
    payload: SubmitHomeworkDto,
    authUser: TAuthUser,
  ) {
    const homework = await this.prisma.homework.findUnique({
      where: { lessonId },
    });
    if (!homework) {
      throw new BadRequestException('This lesson has no homework');
    }
    const homeworkSubmission = await this.prisma.homeworkSubmission.findFirst({
      where: {
        userId: authUser.id,
        homeworkId: homework.id,
        status: {
          in: [HomeworkSubStatus.PENDING, HomeworkSubStatus.APPROVED],
        },
      },
    });
    const file = await this.filesService.saveFile(
      payload.file,
      EFileType.COURSE_CONTENT,
    );
    if (!homeworkSubmission) {
      return this.prisma.homeworkSubmission.create({
        data: {
          userId: authUser.id,
          homeworkId: homework.id,
          text: payload?.text,
          file,
        },
      });
    }
    if (homeworkSubmission.status === HomeworkSubStatus.PENDING) {
      throw new BadRequestException(
        'Your submission in pending status. Please be patient.',
      );
    }
    if (homeworkSubmission.status === HomeworkSubStatus.APPROVED) {
      throw new BadRequestException('Your submission already approved.');
    }
  }

  async getHomeworkSubmissions(
    query: FetchHomeworkSubmissionsDto,
    authUser: TAuthUser,
  ): PromiseManyData<Partial<HomeworkSubmission>> {
    const pquery = {
      where: {
        status: query?.status,
        userId: +query?.user_id || undefined,
        homeworkId: +query?.homework_id || undefined,
        homework:
          query?.course_id ||
            authUser.role === UserRole.MENTOR ||
            authUser.role === UserRole.ASSISTANT
            ? {
              lesson: {
                group: {
                  course: {
                    id: query?.course_id,
                    assistants:
                      authUser.role === UserRole.ASSISTANT
                        ? {
                          some: {
                            userId: authUser.id,
                          },
                        }
                        : undefined,
                    mentorId:
                      authUser.role === UserRole.MENTOR
                        ? authUser.id
                        : undefined,
                  },
                },
              },
            }
            : undefined,
      },
    };
    const [total, data] = await this.prisma.$transaction([
      this.prisma.homeworkSubmission.count(pquery),
      this.prisma.homeworkSubmission.findMany({
        ...pquery,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          file: true,
          text: true,
          status: true,
          reason: true,
          createdAt: true,
          homework: {
            select: {
              id: true,
              lessonId: true,
            },
          },
          user: {
            select: {
              id: true,
              image: true,
              fullName: true,
              phone: true,
            },
          },
        },
      }),
    ]);
    return { total, data };
  }

  async getHomeworkSubmission(id: number, authUser: TAuthUser) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: {
        id,
        homework:
          authUser.role === UserRole.MENTOR ||
            authUser.role === UserRole.ASSISTANT
            ? {
              lesson: {
                group: {
                  course: {
                    mentorId:
                      authUser.role === UserRole.MENTOR
                        ? authUser.id
                        : undefined,
                    assistants:
                      authUser.role === UserRole.ASSISTANT
                        ? {
                          some: {
                            userId: authUser.id,
                          },
                        }
                        : undefined,
                  },
                },
              },
            }
            : undefined,
      },
      include: {
        homework: true,
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
            phone: true,
          },
        },
      },
    });
    if (!submission) {
      throw new NotFoundException('Homework Submission not found');
    }
    return submission;
  }

  async checkHomework(payload: CheckHomeworkDto, authUser: TAuthUser) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: {
        id: payload.submissionId,
        status: HomeworkSubStatus.PENDING,
        homework:
          authUser.role === UserRole.MENTOR ||
            authUser.role === UserRole.ASSISTANT
            ? {
              lesson: {
                group: {
                  course: {
                    mentorId:
                      authUser.role === UserRole.MENTOR
                        ? authUser.id
                        : undefined,
                    assistants:
                      authUser.role === UserRole.ASSISTANT
                        ? {
                          some: {
                            userId: authUser.id,
                          },
                        }
                        : undefined,
                  },
                },
              },
            }
            : undefined,
      },
    });
    if (!submission) {
      throw new NotFoundException('Homework Submission not found');
    }
    return this.prisma.homeworkSubmission.update({
      where: { id: payload.submissionId },
      data: {
        status: payload.approved
          ? HomeworkSubStatus.APPROVED
          : HomeworkSubStatus.REJECTED,
        reason: payload.reason,
        updatedAt: new Date(),
      },
    });
  }
}
