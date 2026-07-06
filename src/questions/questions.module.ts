import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, FilesService],
})
export class QuestionsModule {}
