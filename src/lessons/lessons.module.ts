import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonGroupController } from './group/group.controller';
import { LessonGroupService } from './group/group.service';
import { FilesService } from '../files/files.service';
import { LessonFilesController } from './files/lesson-files.controller';
import { LessonFilesService } from './files/lesson-files.service';

@Module({
  controllers: [
    LessonsController,
    LessonGroupController,
    LessonFilesController,
  ],
  providers: [
    LessonsService,
    LessonGroupService,
    FilesService,
    LessonFilesService,
  ],
  exports: [LessonsService],
})
export class LessonsModule {}
