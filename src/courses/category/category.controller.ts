import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseCategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../global/guards/roles.guard';
import { Roles } from '../../global/decorators/roles';
import { UserRole } from '../../types/user';
import { CreateCourseCategoryDto } from './dto/create.dto';
import { PaginationDto } from '../../global/dto/pagination.dto';
import { UpdateCourseCategoryDto } from './dto/update.dto';

@ApiTags('Course Category')
@Controller('api/course-category')
export class CourseCategoryController {
  constructor(private readonly categoryService: CourseCategoryService) {}

  @Get('all')
  getAll(@Query() query: PaginationDto) {
    return this.categoryService.getAll(query);
  }

  @Get('single/:id')
  getSingle(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getSingle(id);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post()
  createCategory(@Body() payload: CreateCourseCategoryDto) {
    return this.categoryService.createCategory(payload);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Put(':id')
  updateCategory(
    @Body() payload: UpdateCourseCategoryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoryService.updateCategory(id, payload);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
