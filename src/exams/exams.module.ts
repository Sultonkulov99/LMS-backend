import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { LessonGroupService } from '../lessons/group/group.service';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService, LessonGroupService],
})
export class ExamsModule {}
