import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { TAuthUser, UserRole } from '../types/user';
import { FilesService } from '../files/files.service';
import { EFileType } from '../types/files';
import {
  GetMyQuestionsQueryDto,
  GetQuestionsQueryDto,
} from './dto/get-questions-query.dto';
import { PromiseManyData } from '../types/common/data-response';
import { Question } from '@prisma/client';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  private $selectQuestionWithAnswer = {
    id: true,
    text: true,
    file: true,
    read: true,
    readAt: true,
    updatedAt: true,
    createdAt: true,
    from: {
      select: {
        id: true,
        fullName: true,
        image: true,
      },
    },
    to: {
      select: {
        id: true,
        name: true,
      },
    },
    answer: {
      select: {
        id: true,
        text: true,
        file: true,
        updatedAt: true,
        createdAt: true,
        answeredBy: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          },
        },
      },
    },
  };

  private getCourseWhereOwns(authUser: TAuthUser, courseId?: string) {
    return {
      id: courseId,
      mentorId: authUser.role === UserRole.MENTOR ? authUser.id : undefined,
      assistants:
        authUser.role === UserRole.ASSISTANT
          ? {
              some: {
                userId: authUser.id,
              },
            }
          : undefined,
    };
  }

  async fetchMyQuestions(
    query: GetMyQuestionsQueryDto,
    authUser: TAuthUser,
  ): PromiseManyData<Omit<Question, 'courseId' | 'userId'>> {
    const where = {
      userId: authUser.id,
      courseId: query?.courseId || undefined,
      read: !query?.read ? undefined : query?.read == 'true' || false,
      answer: query?.answered
        ? {
            isNot: query?.answered == 'true' ? null : undefined,
            is: query?.answered == 'false' ? null : undefined,
          }
        : undefined,
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.question.findMany({
        where,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        select: this.$selectQuestionWithAnswer,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.question.count({
        where,
      }),
    ]);
    return { total, data };
  }

  async fetchCourseQuestions(
    courseId: string,
    query: GetQuestionsQueryDto,
    authUser: TAuthUser,
  ): PromiseManyData<Omit<Question, 'courseId' | 'userId'>> {
    const course = await this.prisma.course.findUnique({
      where: this.getCourseWhereOwns(authUser, courseId),
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const where = {
      courseId,
      read: !query?.read ? undefined : query?.read == 'true' || false,
      answer: query?.answered
        ? {
            isNot: query?.answered == 'true' ? null : undefined,
            is: query?.answered == 'false' ? null : undefined,
          }
        : undefined,
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.question.findMany({
        where,
        take: +query?.limit || 8,
        skip: +query?.offset || 0,
        select: this.$selectQuestionWithAnswer,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.question.count({
        where,
      }),
    ]);
    return { total, data };
  }

  async fetchSingle(id: number, authUser: TAuthUser, simpleSelect?: boolean) {
    const where = {
      id,
    };
    if (authUser.role === UserRole.STUDENT) {
      Object.assign(where, {
        userId: authUser.id,
      });
    } else {
      Object.assign(where, { to: this.getCourseWhereOwns(authUser) });
    }
    const question = await this.prisma.question.findUnique({
      where,
      select: simpleSelect ? undefined : this.$selectQuestionWithAnswer,
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async readQuestion(id: number, authUser: TAuthUser) {
    await this.fetchSingle(id, authUser, true);
    return this.prisma.question.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async createQuestion(
    courseId: string,
    payload: CreateQuestionsDto,
    authUser: TAuthUser,
  ) {
    if (payload?.file) {
      payload.file = await this.filesService.saveFile(
        payload.file,
        EFileType.PUBLIC_FILE,
      );
    }
    return this.prisma.question.create({
      data: {
        courseId,
        text: payload.text,
        file: payload?.file || null,
        userId: authUser.id,
      },
    });
  }

  async updateQuestion(
    id: number,
    payload: UpdateQuestionDto,
    authUser: TAuthUser,
  ) {
    const question = await this.fetchSingle(id, authUser);
    if (question?.answer) {
      throw new BadRequestException("You can't update answered question");
    }
    if (question.file && payload?.file) {
      this.filesService.deleteFile(question.file, EFileType.PUBLIC_FILE);
    }
    if (payload?.file) {
      payload.file = await this.filesService.saveFile(
        payload.file,
        EFileType.PUBLIC_FILE,
      );
    }
    return this.prisma.question.update({
      where: { id },
      data: {
        text: payload?.text || question.text,
        file: payload?.file || question.file,
        updatedAt: new Date(),
      },
    });
  }

  async createAnswer(
    id: number,
    payload: CreateAnswerDto,
    authUser: TAuthUser,
  ) {
    const question = await this.fetchSingle(id, authUser, true);
    if (!question.read) {
      await this.readQuestion(id, authUser);
    }
    if (payload?.file) {
      payload.file = await this.filesService.saveFile(
        payload.file,
        EFileType.PUBLIC_FILE,
      );
    }
    return this.prisma.questionAnswer.create({
      data: {
        userId: authUser.id,
        questionId: id,
        text: payload.text,
        file: payload?.file || null,
      },
    });
  }

  async getSingleAnswer(id: number, authUser: TAuthUser) {
    const answer = await this.prisma.questionAnswer.findUnique({
      where: {
        id,
        question: {
          to: this.getCourseWhereOwns(authUser),
        },
      },
    });
    if (!answer) {
      throw new NotFoundException('Question Answer not found!');
    }
    return answer;
  }

  async updateAnswer(
    id: number,
    payload: UpdateAnswerDto,
    authUser: TAuthUser,
  ) {
    const answer = await this.getSingleAnswer(id, authUser);
    if (answer.file && payload?.file) {
      this.filesService.deleteFile(answer.file, EFileType.PUBLIC_FILE);
    }
    if (payload?.file) {
      payload.file = await this.filesService.saveFile(
        payload.file,
        EFileType.PUBLIC_FILE,
      );
    }
    return this.prisma.questionAnswer.update({
      where: { id },
      data: {
        text: payload?.text || answer.text,
        file: payload?.file || answer.file,
        updatedAt: new Date(),
      },
    });
  }

  async deleteAnswer(id: number, authUser: TAuthUser) {
    const answer = await this.getSingleAnswer(id, authUser);
    if (answer.file) {
      this.filesService.deleteFile(answer.file, EFileType.PUBLIC_FILE);
    }
    await this.prisma.questionAnswer.delete({ where: { id } });
    return { ok: true, message: 'Answer deleted' };
  }

  async deleteQuestion(id: number, authUser: TAuthUser) {
    const question = await this.fetchSingle(id, authUser);
    if (question.file) {
      this.filesService.deleteFile(question.file, EFileType.PUBLIC_FILE);
    }
    if (question.answer?.file) {
      this.filesService.deleteFile(question.answer.file, EFileType.PUBLIC_FILE);
    }
    await this.prisma.question.delete({
      where: { id },
    });
    return {
      ok: true,
      message: 'Question deleted',
    };
  }
}
