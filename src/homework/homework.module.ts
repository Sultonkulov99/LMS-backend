import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService, FilesService],
})
export class HomeworkModule {}
