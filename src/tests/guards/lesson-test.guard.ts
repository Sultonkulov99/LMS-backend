import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { TAuthUser } from '../../types/user';
import { Lesson } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class LessonTestGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TAuthUser;
    const lesson = request.lesson as Lesson;
    const tests = await this.prisma.test.count({
      where: { lessonId: lesson.id },
    });
    if (tests) {
      const testPassed = await this.prisma.testResult.findFirst({
        where: {
          userId: user.id,
          lessonId: lesson.id,
          passed: true,
        },
      });
      if (!testPassed) {
        throw new BadRequestException('You should pass test first');
      }
    }
    return true;
  }
}
