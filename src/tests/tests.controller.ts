import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesValidation } from 'src/files/validation/files-validation';

@ApiTags('Tests')
@Controller('api/tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) { }

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
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 1,
      },
    ]),
  )
  @Post('create')
  createTest(
    @Body() payload: CreateTestDto,
    @Req() req,
    @UploadedFiles(
      new FilesValidation({
        image: { type: 'image', required: false },
      }),
    )
    file?: {
      image?: Express.Multer.File[];
    },
  ) {
    return this.testsService.createTest(
      {
        ...payload,
        image: file?.image?.[0]
      },
      req.user as TAuthUser
    );
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['lessonId', 'tests'],
      properties: {
        lessonId: {
          type: 'string',
        },
        tests: {
          type: 'object',
          description:
            'Savollar massivi, JSON.stringify() qilingan holda yuboriladi (lessonId\'siz). ' +
            'Rasmi bo\'lishi kerak bo\'lgan savolga "image": true deb belgilang ' +
            '— pastdagi "images" ro\'yxatiga yuklagan fayllar xuddi shu ' +
            'tartibda (birinchi belgilangan savolga birinchi fayl, ikkinchisiga ikkinchisi, ' +
            'va hokazo) biriktiriladi. Rasmsiz savollarda "image" kalitini butunlay yozmang.',
          example: [
            {
              question: 'What does DOM mean in JavaScript?',
              image: true,
              variantA: 'Direct Object Module',
              variantB: 'Document Object Model',
              variantC: 'Document Object Model',
              variantD: 'Document Object Module',
              answer: 'variantC',
            },
            {
              question: 'What does CSS stand for?',
              variantA: 'Cascading Style Sheets',
              variantB: 'Creative Style Sheets',
              variantC: 'Computer Style Sheets',
              variantD: 'Colorful Style Sheets',
              answer: 'variantA',
            },
          ],
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Rasmlar ro\'yxati (ixtiyoriy) — kerakcha ko\'p yoki kam fayl qo\'shishingiz/olib ' +
            'tashlashingiz mumkin, fayl nomi muhim emas. "tests" ichida "image": true deb ' +
            'belgilangan savollarga shu ro\'yxatdagi fayllar TARTIB bo\'yicha biriktiriladi.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('create/many')
  createManyTest(
    @Body() payload: CreateManyTestDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req,
  ) {
    const tests = this.attachImagesInOrder(payload.tests, images);
    return this.testsService.createManyTest(
      { ...payload, tests },
      req.user as TAuthUser,
    );
  }

  private attachImagesInOrder(
    tests: Omit<CreateTestDto, 'lessonId'>[],
    images: Express.Multer.File[] = [],
  ): Omit<CreateTestDto, 'lessonId'>[] {
    const mimeRegex = /(png|jpg|jpeg)$/;
    for (const file of images) {
      const mime = file.mimetype.split('/')[1];
      if (!mimeRegex.test(mime)) {
        throw new HttpException(
          `Invalid file type for "${file.originalname}"! Only image files are allowed`,
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }
    }

    const expectedCount = tests.filter((t) => !!t.image).length;
    if (expectedCount !== images.length) {
      throw new HttpException(
        `"tests" ichida ${expectedCount} ta savolda "image": true belgilangan, lekin "images" ro'yxatida ${images.length} ta fayl yuklandi. Ular soni bir xil bo'lishi kerak`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let cursor = 0;
    return tests.map((test) => {
      if (!test.image) return test;
      return { ...test, image: images[cursor++] };
    });
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 1,
      },
    ]),
  )
  @Patch('update/:id')
  updateTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateTestDto,
    @Req() req,
    @UploadedFiles(
      new FilesValidation({
        image: { type: 'image', required: false },
      }),
    )
    file?: {
      image: Express.Multer.File[];
    },
  ) {
    return this.testsService.updateTest(id, {...payload, image: file?.image?.[0]}, req.user as TAuthUser);
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
