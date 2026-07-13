import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTestDto, CreateManyTestDto } from './dto/create-test.dto';
import { TAuthUser } from '../types/user';
import { AnswerTestDto } from './dto/answer-test.dto';
import { getPastTime } from '../utils/time';
import { UpdateTestDto } from './dto/update-test.dto';
import { PromiseManyData } from '../types/common/data-response';
import { TestResult } from '@prisma/client';
import {
  FetchTestResultsDto,
  FetchGroupTestResultsDto,
} from './dto/fetch-test-results.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { LessonsService } from 'src/lessons/lessons.service';

@Injectable()
export class TestsService {
  constructor(
    private prisma: PrismaService,
    private lessonService: LessonsService,
  ) {}

  private async checkIsNotPassed(lessonId: string, authUser: TAuthUser) {
    const passed = await this.prisma.testResult.findFirst({
      where: {
        lessonId,
        userId: authUser.id,
        passed: true,
      },
    });
    if (passed) {
      throw new BadRequestException('You already passed this test');
    }
    return passed;
  }

  async getGroupTests(lessonId: string, authUser: TAuthUser, admin?: boolean) {
    if (admin) {
      await this.lessonService.getSingleLesson(lessonId);
    } else {
      await this.checkIsNotPassed(lessonId, authUser);
    }
    return this.prisma.test.findMany({
      where: {
        lessonId,
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

  async passTest(payload: AnswerTestDto, authUser: TAuthUser) {
    await this.checkIsNotPassed(payload.lessonId, authUser);
    const pastTestsCount = await this.prisma.testResult.count({
      where: {
        lessonId: payload.lessonId,
        userId: authUser.id,
        createdAt: {
          gt: getPastTime(14400),
        },
      },
    });
    if (pastTestsCount >= 3) {
      throw new BadRequestException(
        'Too many attempts, please try again later',
      );
    }
    const tests = await this.prisma.test.findMany({
      where: {
        lessonId: payload.lessonId,
      },
      select: {
        id: true,
        answer: true,
      },
    });
    if (tests.length !== payload.answers.length) {
      throw new HttpException(
        "Answers' length is not the same with tests' length",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const correctAnswers = payload.answers.filter((an) => {
      const test = tests.find((t) => t.id === an.id);
      return test?.answer === an.answer;
    });
    const wrongs = tests.length - correctAnswers.length;
    const percent = (correctAnswers.length / tests.length) * 100;
    return this.prisma.testResult.create({
      data: {
        lessonId: payload.lessonId,
        userId: authUser.id,
        passed: percent > 50,
        corrects: correctAnswers.length,
        wrongs,
      },
    });
  }

  async createTest(payload: CreateTestDto, authUser: TAuthUser) {
    await this.lessonService.getSingleLesson(payload.lessonId);
    return this.prisma.test.create({
      data: payload,
    });
  }

  async createManyTest(payload: CreateManyTestDto, authUser: TAuthUser) {
    await this.lessonService.getSingleLesson(payload.lessonId);
    const data = payload.tests.map((t) => ({
      ...t,
      lessonId: payload.lessonId,
    }));
    return this.prisma.test.createMany({
      data,
    });
  }

  async getDetail(id: number, authUser: TAuthUser) {
    const test = await this.prisma.test.findUnique({
      where: { id },
    });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    const lessonGroup = await this.lessonService.getSingleLesson(test.lessonId);
    return { ...test, lessonGroup };
  }

  async updateTest(id: number, payload: UpdateTestDto, authUser: TAuthUser) {
    const test = await this.getDetail(id, authUser);
    return this.prisma.test.update({
      where: { id },
      data: {
        question: payload?.question || test.question,
        variantA: payload?.variantA || test.variantA,
        variantB: payload?.variantB || test.variantB,
        variantC: payload?.variantC || test.variantC,
        variantD: payload?.variantD || test.variantD,
        answer: payload?.answer || test.answer,
      },
    });
  }

  async deleteTest(id: number, authUser: TAuthUser) {
    await this.getDetail(id, authUser);
    await this.prisma.test.delete({
      where: { id },
    });
    return { success: true, message: 'Test deleted' };
  }

  // Test results
  private getTestResultsPrismaQuery(query: FetchTestResultsDto) {
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

  async getTestResults(
    query: FetchTestResultsDto,
  ): PromiseManyData<TestResult> {
    const pquery = this.getTestResultsPrismaQuery(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.testResult.findMany({
        ...pquery,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        include: {
          lessons: {
            select: {
              name: true,
              group: {
                select: {
                  course: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
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
      this.prisma.testResult.count(pquery),
    ]);
    return { total, data };
  }

  async getGroupTestResults(
    id: string,
    query: FetchGroupTestResultsDto,
    authUser: TAuthUser,
  ): PromiseManyData<TestResult> {
    await this.lessonService.getSingleLesson(id);
    const pquery = this.getTestResultsPrismaQuery(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.testResult.findMany({
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
      this.prisma.testResult.count(pquery),
    ]);
    return { total, data };
  }
}
