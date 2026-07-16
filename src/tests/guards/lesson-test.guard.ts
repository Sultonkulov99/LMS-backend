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

    const lessonsInGroup = await this.prisma.lesson.findMany({
      where: { groupId: lesson.groupId },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    const currentIndex = lessonsInGroup.findIndex((l) => l.id === lesson.id);

    if (currentIndex === 0) {
      return true;
    }

    const previousLesson = lessonsInGroup[currentIndex - 1];

    const previousLessonTestCount = await this.prisma.test.count({
      where: { lessonId: previousLesson.id },
    });

    if (previousLessonTestCount > 0) {
      const previousTestPassed = await this.prisma.testResult.findFirst({
        where: {
          userId: user.id,
          lessonId: previousLesson.id,
          passed: true,
        },
      });
      if (!previousTestPassed) {
        throw new BadRequestException(
          'You should pass the previous lesson test first',
        );
      }
    }

    return true;
  }
}
