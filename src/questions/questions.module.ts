import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { FilesService } from '../files/files.service';
import { QuestionsGateway } from './questions.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [QuestionsController],
  providers: [QuestionsService, FilesService, QuestionsGateway],
  exports: [QuestionsGateway],
})
export class QuestionsModule {}