import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseCategoryController } from './category/category.controller';
import { CourseCategoryService } from './category/category.service';
import { FilesService } from '../files/files.service';
import { CourseRatingController } from './rating/rating.controller';
import { CourseRatingService } from './rating/rating.service';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  controllers: [
    CoursesController,
    CourseCategoryController,
    CourseRatingController,
  ],
  providers: [
    CoursesService,
    CourseCategoryService,
    CourseRatingService,
    PrismaService,
    FilesService,
  ],
})
export class CoursesModule {}
