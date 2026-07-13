import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { LessonsModule } from 'src/lessons/lessons.module';

@Module({
  imports: [LessonsModule],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
