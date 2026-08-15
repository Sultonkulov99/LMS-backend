import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CourseLevel } from '../../types/course';
import { Transform } from 'class-transformer';
import { uzMsg } from '../../global/validation-messages';

export class FetchCoursesDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: uzMsg.isString('Qidiruv') })
  search?: string;

  @ApiProperty({
    required: false,
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel, { message: uzMsg.isEnum('Daraja') })
  level?: CourseLevel;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString({}, { message: uzMsg.isNumberString('Kategoriya') })
  category_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString({}, { message: uzMsg.isNumberString('Mentor') })
  @IsOptional()
  mentor_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: uzMsg.isNumber('Minimal narx') })
  @Min(0, { message: uzMsg.min('Minimal narx', 0) })
  @Transform((val) => +val?.value)
  price_min?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: uzMsg.isNumber('Maksimal narx') })
  @Min(1, { message: uzMsg.min('Maksimal narx', 1) })
  @Transform((val) => +val?.value)
  price_max?: string;
}

export class FetchUserCourses extends FetchCoursesDto {
  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString({ message: uzMsg.isBooleanString('Nashr qilingan holati') })
  @IsOptional()
  published?: 'true' | 'false';
}
