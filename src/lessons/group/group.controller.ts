import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LessonGroupService } from './group.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../global/guards/roles.guard';
import { Roles } from '../../global/decorators/roles';
import { TAuthUser, UserRole } from '../../types/user';
import { CreateLessonGroupDto } from './dto/create.dto';
import { UpdateLessonGroupDto } from './dto/update.dto';
import { FetchGroupsDto } from './dto/fetch-groups.dto';

@ApiTags('Lesson Groups')
@Controller('api/lesson-group')
export class LessonGroupController {
  constructor(private readonly groupService: LessonGroupService) {}

  @Get('all/:course_id')
  getAll(@Query() query: FetchGroupsDto, @Param('course_id') courseId: string) {
    return this.groupService.getAll(courseId, query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: UserRole.STUDENT,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.STUDENT])
  @Get('mine-all/:course_id')
  getAllMine(
    @Query() query: FetchGroupsDto,
    @Param('course_id') courseId: string,
    @Request() req,
  ) {
    return this.groupService.getAll(courseId, query, req.user as TAuthUser);
  }

  @Get('detail/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN])
  getSingle(@Param('id') id: string, @Request() req) {
    const authUser = req.user as TAuthUser;
    return this.groupService.getSingle(+id, authUser);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN])
  @Post()
  createLessonGroup(@Body() payload: CreateLessonGroupDto, @Request() req) {
    const authUser = req.user as TAuthUser;
    return this.groupService.createLessonGroup(payload, authUser);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN])
  @Put(':id')
  updateCategory(
    @Body() payload: UpdateLessonGroupDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    const authUser = req.user as TAuthUser;
    return this.groupService.updateLessonGroup(+id, payload, authUser);
  }

  @ApiOperation({
    summary: `${UserRole.MENTOR}, ${UserRole.ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.MENTOR, UserRole.ADMIN])
  @Delete(':id')
  deleteCategory(@Param('id') id: string, @Request() req) {
    const authUser = req.user as TAuthUser;
    return this.groupService.deleteCategory(+id, authUser);
  }
}
