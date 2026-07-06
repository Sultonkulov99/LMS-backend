import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LessonGroupService } from '../lessons/group/group.service';
import { CreateExamDto, CreateManyExamDto } from './dto/create-exam.dto';
import { TAuthUser } from '../types/user';
import { AnswerExamDto } from './dto/answer-exam.dto';
import { getPastTime } from '../utils/time';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PromiseManyData } from '../types/common/data-response';
import { ExamResult } from '@prisma/client';
import {
  FetchExamResultsDto,
  FetchGroupExamResultsDto,
} from './dto/fetch-exam-results.dto';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private lessonGroupService: LessonGroupService,
  ) {}

  private async checkIsNotPassed(groupId: number, authUser: TAuthUser) {
    const passed = await this.prisma.examResult.findFirst({
      where: {
        lessonGroupId: groupId,
        userId: authUser.id,
        passed: true,
      },
    });
    if (passed) {
      throw new BadRequestException('You already passed this exam');
    }
    return passed;
  }

  async getGroupExams(groupId: number, authUser: TAuthUser, admin?: boolean) {
    if (admin) {
      await this.lessonGroupService.getSingle(groupId, authUser);
    } else {
      await this.checkIsNotPassed(groupId, authUser);
    }
    return this.prisma.exam.findMany({
      where: {
        lessonGroupId: groupId,
      },
      select: {
        id: true,
        question: true,
        variantA: true,
        variantB: true,
        variantC: true,
        variantD: true,
        answer: admin,
        createdAt: admin,
      },
    });
  }

  async passExam(payload: AnswerExamDto, authUser: TAuthUser) {
    await this.checkIsNotPassed(payload.lessonGroupId, authUser);
    const pastExamsCount = await this.prisma.examResult.count({
      where: {
        lessonGroupId: payload.lessonGroupId,
        userId: authUser.id,
        createdAt: {
          gt: getPastTime(14400),
        },
      },
    });
    if (pastExamsCount >= 3) {
      throw new BadRequestException(
        'Too many attempts, please try again later',
      );
    }
    const exams = await this.prisma.exam.findMany({
      where: {
        lessonGroupId: payload.lessonGroupId,
      },
      select: {
        id: true,
        answer: true,
      },
    });
    if (exams.length !== payload.answers.length) {
      throw new HttpException(
        "Answers' length is not the same with exams' length",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const correctAnswers = payload.answers.filter((an) => {
      const exam = exams.find((e) => e.id === an.id);
      return exam?.answer === an.answer;
    });
    const wrongs = exams.length - correctAnswers.length;
    const percent = (correctAnswers.length / exams.length) * 100;
    return this.prisma.examResult.create({
      data: {
        lessonGroupId: payload.lessonGroupId,
        userId: authUser.id,
        passed: percent > 50,
        corrects: correctAnswers.length,
        wrongs,
      },
    });
  }

  async createExam(payload: CreateExamDto, authUser: TAuthUser) {
    await this.lessonGroupService.getSingle(payload.lessonGroupId, authUser);
    return this.prisma.exam.create({
      data: payload,
    });
  }

  async createManyExam(payload: CreateManyExamDto, authUser: TAuthUser) {
    await this.lessonGroupService.getSingle(payload.lessonGroupId, authUser);
    const data = payload.exams.map((ex) => ({
      ...ex,
      lessonGroupId: payload.lessonGroupId,
    }));
    return this.prisma.exam.createMany({
      data,
    });
  }

  async getDetail(id: number, authUser: TAuthUser) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    const lessonGroup = await this.lessonGroupService.getSingle(
      exam.lessonGroupId,
      authUser,
    );
    return { ...exam, lessonGroup };
  }

  async updateExam(id: number, payload: UpdateExamDto, authUser: TAuthUser) {
    const exam = await this.getDetail(id, authUser);
    return this.prisma.exam.update({
      where: { id },
      data: {
        question: payload?.question || exam.question,
        variantA: payload?.variantA || exam.variantA,
        variantB: payload?.variantB || exam.variantB,
        variantC: payload?.variantC || exam.variantC,
        variantD: payload?.variantD || exam.variantD,
        answer: payload?.answer || exam.answer,
      },
    });
  }

  async deleteExam(id: number, authUser: TAuthUser) {
    await this.getDetail(id, authUser);
    await this.prisma.exam.delete({
      where: { id },
    });
    return { success: true, message: 'Exam deleted' };
  }

  // Exam results
  private getExamResultsPrismaQuery(query: FetchExamResultsDto) {
    const pquery = {
      where: {},
    };
    if (query?.user_id) {
      Object.assign(pquery.where, {
        userId: +query.user_id,
      });
    }
    if (query?.lesson_group_id) {
      Object.assign(pquery.where, {
        lessonGroupId: +query.lesson_group_id,
      });
    }
    if (query?.passed) {
      Object.assign(pquery.where, {
        passed: query.passed === 'true',
      });
    }
    if (query?.date_from) {
      Object.assign(pquery.where, {
        createdAt: {
          gte: new Date(query.date_from),
        },
      });
    }
    if (query?.date_to) {
      Object.assign(pquery.where, {
        createdAt: {
          gte: new Date(query.date_to),
        },
      });
    }
    return pquery;
  }

  async getExamResults(
    query: FetchExamResultsDto,
  ): PromiseManyData<ExamResult> {
    const pquery = this.getExamResultsPrismaQuery(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.examResult.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        include: {
          lessonGroup: {
            select: {
              name: true,
              course: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              fullName: true,
              image: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.examResult.count(pquery),
    ]);
    return { total, data };
  }

  async getGroupExamResults(
    id: number,
    query: FetchGroupExamResultsDto,
    authUser: TAuthUser,
  ): PromiseManyData<ExamResult> {
    await this.lessonGroupService.getSingle(id, authUser);
    const pquery = this.getExamResultsPrismaQuery(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.examResult.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        include: {
          user: {
            select: {
              fullName: true,
              image: true,
            },
          },
        },
      }),
      this.prisma.examResult.count(pquery),
    ]);
    return { total, data };
  }
}
