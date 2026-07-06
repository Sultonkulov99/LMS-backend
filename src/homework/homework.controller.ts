import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HomeworkService } from './homework.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TAuthUser, UserRole } from '../types/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { PaginationDto } from '../global/dto/pagination.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { PurchasedCourseGuard } from '../purchased-courses/guards/purchased-course.guard';
import { LessonExamGuard } from '../exams/guards/lesson-exam.guard';
import { CheckHomeworkDto } from './dto/check-homework.dto';
import { FetchHomeworkSubmissionsDto } from './dto/fetch-homework-submissions.dto';

@ApiTags('Homework')
@Controller('api/homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT])
  @Get('course/:id')
  getCourseHomeWorks(
    @Param('id') id: string,
    @Query() query: PaginationDto,
    @Req() req,
  ) {
    return this.homeworkService.getCourseHomeWorks(
      id,
      query,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT])
  @Get('detail/:id')
  getDetailHomework(@Param('id') id: string, @Req() req) {
    return this.homeworkService.getDetailHomework(+id, req.user as TAuthUser);
  }

  @ApiOperation({ summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('create')
  createHomework(
    @Body() payload: CreateHomeworkDto,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() req,
  ) {
    payload.file = file;
    return this.homeworkService.createHomework(payload, req.user as TAuthUser);
  }

  @ApiOperation({ summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Patch('update/:id')
  updateHomework(
    @Param('id') id: string,
    @Body() payload: UpdateHomeworkDto,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() req,
  ) {
    payload.file = file;
    return this.homeworkService.updateHomework(
      +id,
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({ summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN])
  @Delete('delete/:id')
  deleteHomework(@Param('id') id: string, @Req() req) {
    return this.homeworkService.deleteHomework(+id, req.user as TAuthUser);
  }

  // Submissions
  @ApiOperation({ summary: `${UserRole.STUDENT}` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard, LessonExamGuard)
  @Roles([UserRole.STUDENT])
  @Get('submission/mine/:lessonId')
  getMyHomeworkSubmissions(
    @Param('lessonId') id: string,
    @Query() query: PaginationDto,
    @Req() req,
  ) {
    return this.homeworkService.getMyHomeworkSubmissions(
      id,
      query,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({ summary: `${UserRole.STUDENT}` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard, LessonExamGuard)
  @Roles([UserRole.STUDENT])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('submission/submit/:lessonId')
  submitHomework(
    @Param('lessonId') lessonId: string,
    @Body() payload: SubmitHomeworkDto, 
    @UploadedFile('file') file: Express.Multer.File,
    @Req() req,
  ) {
    payload.file = file;
    return this.homeworkService.submitHomework( 
      lessonId,
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT])
  @Get('submissions/all')
  getHomeworkSubmissions(
    @Query() query: FetchHomeworkSubmissionsDto,
    @Req() req,
  ) {
    return this.homeworkService.getHomeworkSubmissions(
      query,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT])
  @Get('submissions/single/:id')
  getHomeworkSubmission(@Param('id') id: string, @Req() req) {
    return this.homeworkService.getHomeworkSubmission(
      +id,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT])
  @Post('submission/check')
  checkHomework(@Body() payload: CheckHomeworkDto, @Req() req) {
    return this.homeworkService.checkHomework(payload, req.user as TAuthUser);
  }
}
