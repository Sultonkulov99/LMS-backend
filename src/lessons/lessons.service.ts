import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { TAuthUser, UserRole } from '../types/user';
import { LessonGroupService } from './group/group.service';
import { FilesService } from '../files/files.service';
import { EFileType } from '../types/files';
import { UpdateLessonDto } from './dto/udpate-lesson.dto';
import { UpdateLessonViewDto } from './dto/update-lesson-view.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private groupService: LessonGroupService,
    private filesService: FilesService,
  ) {}

  getSingleLesson(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        about: true,
        groupId: true,
        updatedAt: true,
        createdAt: true,
        homework: true,
        // youtube_link: true,
        lessonFiles: true,
      },
    });
  }

  async updateLessonView(
    lessonId: string,
    payload: UpdateLessonViewDto,
    authUser: TAuthUser,
  ) {
    const where = {
      lessonId_userId: {
        userId: authUser.id,
        lessonId,
      },
    };
    const lessonView = await this.prisma.lessonView.findUnique({ where });
    if (!lessonView) {
      return this.prisma.lessonView.create({
        data: {
          lessonId,
          userId: authUser.id,
          view: payload.view,
        },
      });
    }
    return this.prisma.lessonView.update({
      where,
      data: { view: payload.view },
    });
  }

  async getDetail(id: string, authUser: TAuthUser) {
    const args = {
      where: {
        id,
      },
    };
    if (authUser.role === UserRole.MENTOR) {
      Object.assign(args.where, {
        group: {
          course: {
            mentorId: authUser.id,
          },
        },
      });
    }
    const lesson = await this.prisma.lesson.findUnique(args);
    if (!lesson) {
      throw new HttpException('Lesson not found!', HttpStatus.NOT_FOUND);
    }
    return lesson;
  }

  async createLesson(payload: CreateLessonDto, authUser: TAuthUser) {
    const group = await this.groupService.getSingle(+payload.groupId, authUser);
    const lesson = await this.prisma.lesson.create({
      data: {
        name: payload.name,
        about: payload.about,
        groupId: group.id,
        youtube_link: payload.youtube_link || "empty",
        video: 'empty',
      },
    });
    const video = await this.filesService.saveLessonVideo(
      payload.video,
      lesson.id,
    );
    return this.prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        video,
      },
    });
  }

  async updateLesson(
    id: string,
    payload: UpdateLessonDto,
    authUser: TAuthUser,
  ) {
    const lesson = await this.getDetail(id, authUser);
    if (payload?.video) {
      this.filesService.deleteLessonVideos(id);
      payload.video = await this.filesService.saveLessonVideo(
        payload.video,
        id,
      );
    }
    return this.prisma.lesson.update({
      where: { id },
      data: {
        video: payload.video || lesson.video,
        name: payload.name || lesson.name,
        about: payload.about || lesson.about,
        updatedAt: new Date(),
      },
    });
  }

  async deleteLesson(id: string, authUser: TAuthUser) {
    const lesson = await this.getDetail(id, authUser);
    const lessonFiles = await this.prisma.lessonFile.findMany({
      where: {
        lessonId: id,
      },
    });
    lessonFiles.forEach((lf) => {
      this.filesService.deleteFile(lf.file, EFileType.COURSE_CONTENT);
    });
    this.filesService.deleteLessonVideos(id);
    await this.prisma.lesson.delete({
      where: { id },
    });
    return { success: true, message: 'Lesson deleted' };
  }
}
