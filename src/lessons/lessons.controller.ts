import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { TAuthUser, UserRole } from '../types/user';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { UpdateLessonDto } from './dto/udpate-lesson.dto';
import { PurchasedCourseGuard } from '../purchased-courses/guards/purchased-course.guard';
import { LessonExamGuard } from '../exams/guards/lesson-exam.guard';
import { validateFile } from '../files/validation/file-validation';
import { UpdateLessonViewDto } from './dto/update-lesson-view.dto';

@ApiTags('Lessons')
@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiOperation({
    summary: `${UserRole.STUDENT}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard, LessonExamGuard)
  @Roles([UserRole.STUDENT])
  @Get('single/:lessonId')
  getSingleLesson(@Param('lessonId') id: string) {
    return this.lessonsService.getSingleLesson(id);
  }

  @ApiOperation({
    summary: `${UserRole.STUDENT}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard, LessonExamGuard)
  @Roles([UserRole.STUDENT])
  @Put('view/:lessonId')
  updateLessonView(
    @Param('lessonId') id: string,
    @Body() payload: UpdateLessonViewDto,
    @Request() req,
  ) {
    return this.lessonsService.updateLessonView(
      id,
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR])
  @Get('detail/:id')
  getDetail(@Param('id') id: string, @Request() req) {
    const user = req.user as TAuthUser;
    return this.lessonsService.getDetail(id, user);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @Post('create')
  createLesson(
    @Body() payload: CreateLessonDto,
    @UploadedFile(validateFile({ required: false, size: 500, type: 'video' }))
    video: Express.Multer.File,
    @Request() req,
  ) {
    const user = req.user as TAuthUser;
    return this.lessonsService.createLesson(
      {
        ...payload,
        video,
      },
      user,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @Patch(':id')
  updateLesson(
    @Param('id') id: string,
    @Body() payload: UpdateLessonDto,
    @UploadedFile(validateFile({ required: false, size: 500, type: 'video' }))
    video: Express.Multer.File,
    @Request() req,
  ) {
    const user = req.user as TAuthUser;
    return this.lessonsService.updateLesson(
      id,
      {
        ...payload,
        video,
      },
      user,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR])
  @Delete(':id')
  deleteLesson(@Param('id') id: string, @Request() req) {
    const user = req.user as TAuthUser;
    return this.lessonsService.deleteLesson(id, user);
  }
}
