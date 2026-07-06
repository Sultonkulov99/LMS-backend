import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { TAuthUser } from '../../types/user';
import { Lesson } from '@prisma/client';

@Injectable()
export class LessonExamGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TAuthUser;
    const lesson = request.lesson as Lesson;
    const exams = await this.prisma.exam.count({
      where: { lessonGroupId: lesson.groupId },
    });
    if (exams) {
      const examPassed = await this.prisma.examResult.findFirst({
        where: {
          userId: user.id,
          lessonGroupId: lesson.groupId,
          passed: true,
        },
      });
      if (!examPassed) {
        throw new BadRequestException('You should pass exam first');
      }
    }
    return true;
  }
}
