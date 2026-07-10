import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateCourseDto } from './dto/create-course.dto';
import { FetchCoursesDto, FetchUserCourses } from './dto/fetch-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseMentorDto } from './dto/update-course-mentor.dto';
import { AssignCourseDto } from './dto/assign-course.dto';
import { PaginationDto } from '../global/dto/pagination.dto';
import { FilesValidation } from '../files/validation/files-validation';

@ApiTags('Courses')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getCourses(@Query() query: FetchCoursesDto) {
    return this.coursesService.getCourses(query);
  }

  @Get('single/:id')
  getCourse(@Param('id') id: string) {
    return this.coursesService.getCourse(id);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('my')
  getMyCourses(@Query() query: FetchUserCourses, @Request() req) {
    return this.coursesService.getUserCourses(query, req.user?.id, true);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('mentor/:id')
  getUserCourses(@Param('id') id: string, @Query() query: FetchUserCourses) {
    return this.coursesService.getUserCourses(query, +id);
  }

  @ApiOperation({
    summary: `${UserRole.ASSISTANT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ASSISTANT, UserRole.SUPER_ADMIN])
  @Get('my/assigned')
  getMyAssignedCourses(@Query() query: FetchUserCourses, @Request() req) {
    return this.coursesService.getMyAssignedCourses(
      query,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get(':courseId/assistants')
  getCourseAssistants(
    @Param('courseId') id: string,
    @Query() query: PaginationDto,
    @Request() req,
  ) {
    return this.coursesService.getCourseAssistants(
      id,
      query,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post('assign-assistant')
  assignCourse(@Body() payload: AssignCourseDto, @Request() req) {
    return this.coursesService.assignCourse(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post('unassign-assistant')
  deleteAssignedCourse(@Body() payload: AssignCourseDto, @Request() req) {
    return this.coursesService.deleteAssignedCourse(
      payload,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'banner',
        maxCount: 1,
      },
      {
        name: 'introVideo',
        maxCount: 1,
      },
    ]),
  )
  @Post('create')
  createCourse(
    @Body() payload: CreateCourseDto,
    @Request() req,
    @UploadedFiles(
      new FilesValidation({
        banner: { size: 1, type: 'image', required: true },
        introVideo: { size: 100, type: 'video' },
      }),
    )
    files: {
      banner: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
  ) {
    const authUser = req.user as TAuthUser;
    return this.coursesService.createCourse(
      {
        ...payload,
        banner: files.banner[0],
        introVideo: files.introVideo?.[0],
      },
      authUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'banner',
        maxCount: 1,
      },
      {
        name: 'introVideo',
        maxCount: 1,
      },
    ]),
  )
  @Patch('update/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() payload: UpdateCourseDto,
    @Request() req,
    @UploadedFiles(
      new FilesValidation({
        banner: { type: 'image' },
        introVideo: { type: 'video' },
      }),
    )
    files: {
      banner?: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
  ) {
    const authUser = req.user as TAuthUser;
    return this.coursesService.updateCourse(
      id,
      {
        ...payload,
        banner: files.banner?.[0],
        introVideo: files.introVideo?.[0],
      },
      authUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post('publish/:id')
  publishCourse(@Param('id') id: string) {
    return this.coursesService.changeCoursePublished(id, true);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post('unpublish/:id')
  unPublishCourse(@Param('id') id: string) {
    return this.coursesService.changeCoursePublished(id, false);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Patch('update-mentor')
  updateCourseMentor(@Body() payload: UpdateCourseMentorDto) {
    return this.coursesService.updateCourseMentor(payload);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
    description:
      'You can only delete draft courses. You cannot delete when it has been published, purchased or it has Lessons or Lesson Groups',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Delete('delete/:id')
  deleteCourse(@Param('id') id: string, @Request() req) {
    return this.coursesService.deleteCourse(id, req.user as TAuthUser);
  }
}
