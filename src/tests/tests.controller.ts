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
import { TestsService } from './tests.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TAuthUser, UserRole } from '../types/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { CreateTestDto, CreateManyTestDto } from './dto/create-test.dto';
import { AnswerTestDto } from './dto/answer-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import {
  FetchTestResultsDto,
  FetchGroupTestResultsDto,
} from './dto/fetch-test-results.dto';
import { PurchasedCourseGuard } from '../purchased-courses/guards/purchased-course.guard';

@ApiTags('Tests')
@Controller('api/tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Get('lesson/:lessonId')
  getLessonTests(@Param('lessonId') id: string, @Req() req) {
    return this.testsService.getGroupTests(id, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.STUDENT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PurchasedCourseGuard)
  @Roles([UserRole.STUDENT, UserRole.SUPER_ADMIN])
  @Post('pass')
  passTest(@Body() payload: AnswerTestDto, @Req() req) {
    return this.testsService.passTest(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('lesson/details/:id')
  getGroupTestsAdmin(@Param('id') id: string, @Req() req) {
    return this.testsService.getGroupTests(id, req.user as TAuthUser, true);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Get('detail/:id')
  getDetail(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.testsService.getDetail(id, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Post('create')
  createTest(@Body() payload: CreateTestDto, @Req() req) {
    return this.testsService.createTest(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Post('create/many')
  createManyTest(@Body() payload: CreateManyTestDto, @Req() req) {
    return this.testsService.createManyTest(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Patch('update/:id')
  updateTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateTestDto,
    @Req() req,
  ) {
    return this.testsService.updateTest(id, payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Delete(':id')
  deleteTest(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.testsService.deleteTest(id, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('results')
  getTestResults(@Query() query: FetchTestResultsDto) {
    return this.testsService.getTestResults(query);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Get('results/lesson/:id')
  getGroupTestResults(
    @Param('id') id: string,
    @Query() query: FetchGroupTestResultsDto,
    @Req() req,
  ) {
    return this.testsService.getGroupTestResults(
      id,
      query,
      req.user as TAuthUser,
    );
  }
}
