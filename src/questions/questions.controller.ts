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
import { QuestionsService } from './questions.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TAuthUser, UserRole } from '../types/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PurchasedCourseGuard } from '../purchased-courses/guards/purchased-course.guard';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { validateFile } from '../files/validation/file-validation';
import {
  GetMyQuestionsQueryDto,
  GetQuestionsQueryDto,
} from './dto/get-questions-query.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@ApiTags('Questions & Answers')
@Controller('api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.STUDENT}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT])
  @Get('mine')
  fetchMyQuestions(@Query() query: GetMyQuestionsQueryDto, @Req() req) {
    return this.questionsService.fetchMyQuestions(query, req.user as TAuthUser);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT])
  @Get('course/:courseId')
  fetchCourseQuestions(
    @Param('courseId') courseId: string,
    @Query() query: GetQuestionsQueryDto,
    @Req() req,
  ) {
    return this.questionsService.fetchCourseQuestions(
      courseId,
      query,
      req.user as TAuthUser,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}, ${UserRole.STUDENT}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.MENTOR,
    UserRole.ADMIN,
    UserRole.ASSISTANT,
    UserRole.STUDENT,
  ])
  @Get('single/:id')
  fetchSingle(@Param('id') id: string, @Req() req) {
    return this.questionsService.fetchSingle(+id, req.user as TAuthUser);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.ASSISTANT}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT])
  @Post('read/:id')
  readQuestion(@Param('id') id: string, @Req() req) {
    return this.questionsService.readQuestion(+id, req.user as TAuthUser);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: UserRole.STUDENT })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard)
  @Roles([UserRole.STUDENT])
  @UseInterceptors(FileInterceptor('file'))
  @Post('create/:courseId')
  createQuestion(
    @Param('courseId') courseId: string,
    @Body() payload: CreateQuestionsDto,
    @Req() req: any,
    @UploadedFile(validateFile({ required: false, size: 50 }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      payload.file = file;
    }
    return this.questionsService.createQuestion(
      courseId,
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.STUDENT}`,
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT])
  @UseInterceptors(FileInterceptor('file'))
  @Patch('update/:id')
  updateQuestion(
    @Param('id') id: string,
    @Body() payload: UpdateQuestionDto,
    @Req() req: any,
    @UploadedFile(validateFile({ required: false, size: 50 }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      payload.file = file;
    }
    return this.questionsService.updateQuestion(
      +id,
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `${UserRole.MENTOR}, ${UserRole.ASSISTANT}` })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ASSISTANT])
  @UseInterceptors(FileInterceptor('file'))
  @Post('answer/:id')
  createAnswer(
    @Param('id') id: string,
    @Body() payload: CreateAnswerDto,
    @Req() req: any,
    @UploadedFile(validateFile({ required: false, size: 50 }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      payload.file = file;
    }
    return this.questionsService.createAnswer(
      +id,
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ASSISTANT}, ${UserRole.ADMIN}`,
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN])
  @UseInterceptors(FileInterceptor('file'))
  @Patch('answer/:id')
  updateAnswer(
    @Param('id') id: string,
    @Body() payload: UpdateAnswerDto,
    @Req() req: any,
    @UploadedFile(validateFile({ required: false, size: 50 }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      payload.file = file;
    }
    return this.questionsService.updateAnswer(
      +id,
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ASSISTANT}, ${UserRole.ADMIN}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN])
  @Delete('answer/delete/:id')
  deleteAnswer(@Param('id') id: string, @Req() req) {
    return this.questionsService.deleteAnswer(+id, req.user as TAuthUser);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `${UserRole.STUDENT}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT])
  @Delete('delete/:id')
  deleteQuestion(@Param('id') id: string, @Req() req) {
    return this.questionsService.deleteQuestion(+id, req.user as TAuthUser);
  }
}
