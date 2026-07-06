import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { PrismaService } from '../database/prisma.service';
import { LessonGroupService } from '../lessons/group/group.service';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService, PrismaService, LessonGroupService],
})
export class ExamsModule {}
