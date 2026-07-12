import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLessonFileDto } from './dto/create.dto';
import { TAuthUser } from '../../types/user';
import { LessonsService } from '../lessons.service';
import { FilesService } from '../../files/files.service';
import { EFileType } from '../../types/files';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class LessonFilesService {
  constructor(
    private prisma: PrismaService,
    private lessonsService: LessonsService,
    private filesService: FilesService,
  ) { }

  async getLessonFiles(lessonId: string, authUser: TAuthUser) {
    await this.lessonsService.getDetail(lessonId, authUser);
    return await this.prisma.lessonFile.findMany({
      where: {
        lessonId,
      },
      select: {
        id: true,
        file: true,
        note: true,
        lesson: {
          select: {
            name: true,
          }
        },
        createdAt: true,
      },
    });
  }

  async createFiles(payload: CreateLessonFileDto, authUser: TAuthUser) {
    const lesson = await this.lessonsService.getDetail(
      payload.lessonId,
      authUser,
    );

    const notes = payload?.notes?.toString().split(',') ?? [];
    const operations = [];
    payload.files.forEach((file: Express.Multer.File) => {
      operations.push(
        this.filesService.saveFile(file, EFileType.COURSE_CONTENT),
      );
    });
    const files = await Promise.all<string[]>(operations);
    await this.prisma.lessonFile.createMany({
      data: files.map((file, index) => ({
        lessonId: lesson.id,
        note: notes?.[index] || null,
        file,
      })),
      skipDuplicates: true,
    });
    return files;
  }

  async deleteFile(id: number, authUser: TAuthUser) {
    const file = await this.prisma.lessonFile.findUnique({
      where: {
        id,
      },
    });
    if (!file) {
      throw new HttpException('Lesson File not found', HttpStatus.NOT_FOUND);
    }
    await this.lessonsService.getDetail(file.lessonId, authUser);
    this.filesService.deleteFile(file.file, EFileType.COURSE_CONTENT);
    await this.prisma.lessonFile.delete({
      where: { id },
    });
    return { success: true, message: 'Lesson File deleted' };
  }
}
