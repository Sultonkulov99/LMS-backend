import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseRatingService } from './rating.service';
import { TAuthUser, UserRole } from '../../types/user';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../global/guards/roles.guard';
import { RateCourseDto } from './dto/rate-course.dto';
import { Roles } from '../../global/decorators/roles';
import { PaginationDto } from '../../global/dto/pagination.dto';
import { PurchasedCourseGuard } from '../../purchased-courses/guards/purchased-course.guard';

@ApiTags('Course Rating')
@Controller('api/course-rating')
export class CourseRatingController {
  constructor(private ratingService: CourseRatingService) {}

  @Get('list/:course_id')
  getCourseRates(
    @Param('course_id') id: string,
    @Query() query: PaginationDto,
  ) {
    return this.ratingService.getCourseRates(id, query);
  }

  @Get('analytics/:course_id')
  getCourseRatingAnalytics(@Param('course_id') id: string) {
    return this.ratingService.getCourseRatingAnalytics(id);
  }

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Post()
  rateCourse(@Body() payload: RateCourseDto, @Request() req) {
    const user = req.user as TAuthUser;
    return this.ratingService.rateCourse(payload, user);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Delete(':id')
  deleteRating(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.deleteRating(id);
  }
}
