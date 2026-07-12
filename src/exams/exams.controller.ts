import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TAuthUser, UserRole } from '../types/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { CreateExamDto, CreateManyExamDto } from './dto/create-exam.dto';
import { AnswerExamDto } from './dto/answer-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import {
  FetchExamResultsDto,
  FetchGroupExamResultsDto,
} from './dto/fetch-exam-results.dto';
import { PurchasedCourseGuard } from '../purchased-courses/guards/purchased-course.guard';

@ApiTags('Exams')
@Controller('api/exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Get('lesson-group/:lessonGroupId')
  getGroupExams(@Param('lessonGroupId', ParseIntPipe) id: number, @Req() req) {
    return this.examsService.getGroupExams(id, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Post('pass')
  passExam(@Body() payload: AnswerExamDto, @Req() req) {
    return this.examsService.passExam(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('lesson-group/details/:id')
  getGroupExamsAdmin(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.examsService.getGroupExams(id, req.user as TAuthUser, true);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Get('detail/:id')
  getDetail(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.examsService.getDetail(id, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Post('create')
  createExam(@Body() payload: CreateExamDto, @Req() req) {
    return this.examsService.createExam(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Post('create/many')
  createManyExam(@Body() payload: CreateManyExamDto, @Req() req) {
    return this.examsService.createManyExam(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Patch('update/:id')
  updateExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateExamDto,
    @Req() req,
  ) {
    return this.examsService.updateExam(id, payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Delete(':id')
  deleteExam(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.examsService.deleteExam(id, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('results')
  getExamResults(@Query() query: FetchExamResultsDto) {
    return this.examsService.getExamResults(query);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Get('results/lesson-group/:id')
  getGroupExamResults(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FetchGroupExamResultsDto,
    @Req() req,
  ) {
    return this.examsService.getGroupExamResults(
      id,
      query,
      req.user as TAuthUser,
    );
  }
}
