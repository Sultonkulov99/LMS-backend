import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { LessonsModule } from 'src/lessons/lessons.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [LessonsModule],
  controllers: [TestsController],
  providers: [TestsService, FilesService],
})
export class TestsModule {}
