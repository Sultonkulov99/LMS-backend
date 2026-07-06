import { Module } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { PurchasedCoursesController } from './purchased-courses.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [PurchasedCoursesController],
  providers: [PurchasedCoursesService, PrismaService],
})
export class PurchasedCoursesModule {}
