import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, PrismaService, FilesService],
})
export class QuestionsModule {}
