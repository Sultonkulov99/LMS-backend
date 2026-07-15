import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { TAuthUser } from '../../types/user';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class PurchasedCourseGuard implements CanActivate {
  constructor(private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TAuthUser;

    let lessonGroupId = null;
    const lessonIdFromBody = request?.body?.lessonId;
    const lessonIdFromParams = request?.params?.lessonId;
    const lessonId = lessonIdFromParams || lessonIdFromBody;

    if (lessonId) {
      const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      lessonGroupId = lesson.groupId;
      request.lesson = lesson;
    }
    if ('lessonGroupId' in request?.params) {
      lessonGroupId = +request.params.lessonGroupId;
    }
    let where = null
    if (user.role === UserRole.STUDENT) {
      where = {
        lessonGroups: {
          some: {
            id: lessonGroupId,
          },
        },
        purchases: {
          some: {
            userId: user.id,
          },
        },
      };
    } else {
      where = {
        lessonGroups: {
          some: {
            id: lessonGroupId,
          },
        },
      };
    }
    const courseId = request?.body?.courseId || request?.params?.courseId;
    if (courseId) {
      delete where.lessonGroups;
      Object.assign(where, {
        id: courseId,
      });
    }
    const course = await this.prisma.course.findFirst({ where });
    if (!course) {
      throw new NotFoundException(
        'Lesson Group or Course or Purchased Course not found',
      );
    }
    return true;
  }
}
