import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TAuthUser, UserRole } from '../types/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import {
  CreatePurchaseCourseDto,
  PurchaseCourseDto,
} from './dto/purchase-course.dto';
import { FetchPurchasedCoursesDto } from './dto/fetch-purchased-courses.dto';
import { FetchCourseStudentsDto } from './dto/fetch-course-students.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Purchased Courses')
@Controller('api/purchased-courses')
export class PurchasedCoursesController {
  constructor(
    private readonly purchasedCoursesService: PurchasedCoursesService,
  ) {}

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Get('mine')
  getMyCourses(@Query() query: FetchPurchasedCoursesDto, @Request() req) {
    const user = req.user as TAuthUser;
    return this.purchasedCoursesService.getMyCourses(query, user);
  }

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Get('mine/:course_id')
  getMyCourse(@Param('course_id') id: string, @Request() req) {
    const user = req.user as TAuthUser;
    return this.purchasedCoursesService.getMyCourse(id, user);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('students')
  getPayments() {
    return this.purchasedCoursesService.getPayments( );
  }

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Post('purchase')
  purchaseCourse(@Body() payload: PurchaseCourseDto, @Request() req) {
    const user = req.user as TAuthUser;
    return this.purchasedCoursesService.purchaseCourse(payload, user);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('course/:id/students')
  getCourseStudents(
    @Param('id') id: string,
    @Query() query: FetchCourseStudentsDto,
    @Request() req,
  ) {
    return this.purchasedCoursesService.getCourseStudents(
      id,
      query,
      req.user as TAuthUser,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Put('status')
  updateCompleted(
    @Body() payload: UpdateStatusDto
  ) {
    return this.purchasedCoursesService.updateStatus(payload.courseId, payload.userId);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
    description:
      'This api is used to create purchasedCourse with property paidVia=CASH. Logically when student goes to Learning Center and pays for course by cash then this api is used to create.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post('create')
  createPurchasedCourse(@Body() payload: CreatePurchaseCourseDto) {
    return this.purchasedCoursesService.createPurchasedCourse(payload);
  }
}
