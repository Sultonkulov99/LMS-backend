import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseVideoParamsDto } from './dto/course-video-params.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { UserRole } from '../types/user';
import { PurchasedCourseGuard } from '../purchased-courses/guards/purchased-course.guard';
import { LessonExamGuard } from '../exams/guards/lesson-exam.guard';
import { PrivateLessonFileParamDto } from './dto/private-lesson-file.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('public/:name')
  streamPublicFile(@Param('name') name: string, @Res() res) {
    const file = this.filesService.streamPublicFile(name);
    return file.pipe(res);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard, LessonExamGuard)
  @Roles([UserRole.STUDENT, UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @Get('private/lesson-file/:lessonId/:name')
  streamLessonFile(@Param() params: PrivateLessonFileParamDto, @Res() res) {
    const file = this.filesService.streamLessonFile(params.name);
    return file.pipe(res);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard, LessonExamGuard)
  @Roles([UserRole.STUDENT, UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @Get('private/video/:lessonId/:hlsf')
  streamLessonVideo(
    @Param() params: CourseVideoParamsDto,
    @Res() res: Response,
  ) {
    return this.filesService.streamLessonVideo(params, res);
  }
}
