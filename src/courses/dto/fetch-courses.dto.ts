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

export class FetchCoursesDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  category_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  mentor_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform((val) => +val?.value)
  price_min?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform((val) => +val?.value)
  price_max?: string;
}

export class FetchUserCourses extends FetchCoursesDto {
  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString()
  @IsOptional()
  published?: 'true' | 'false';
}
