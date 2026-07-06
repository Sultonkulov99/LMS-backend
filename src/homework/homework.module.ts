import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService, PrismaService, FilesService],
})
export class HomeworkModule {}
