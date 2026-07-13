import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { LessonsModule } from 'src/lessons/lessons.module';

@Module({
  imports: [LessonsModule],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
