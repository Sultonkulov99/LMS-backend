import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LessonFilesService } from './lesson-files.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TAuthUser, UserRole } from '../../types/user';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../global/guards/roles.guard';
import { Roles } from '../../global/decorators/roles';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateLessonFileDto } from './dto/create.dto';
import { FilesValidation } from '../../files/validation/files-validation';

@ApiTags('Lesson Files')
@Controller('api/lesson-files')
export class LessonFilesController {
  constructor(private lessonFilesService: LessonFilesService) { }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Get('lesson/:lesson_id')
  getLessonFiles(@Param('lesson_id') id: string, @Request() req) {
    const user = req.user as TAuthUser;
    return this.lessonFilesService.getLessonFiles(id, user);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
    description: 'notes should be JSON array string[] type or null',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'files',
        maxCount: 10,
      },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @Post()
  createFiles(
    @Body() payload: CreateLessonFileDto,
    @UploadedFiles(new FilesValidation({ files: { required: true } }))
    files: { files: Express.Multer.File[] },
    @Request() req,
  ) {
    const user = req.user as TAuthUser;
    return this.lessonFilesService.createFiles(
      {
        ...payload,
        files: files.files,
      },
      user,
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Delete(':id')
  deleteFile(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user as TAuthUser;
    return this.lessonFilesService.deleteFile(id, user);
  }
}
