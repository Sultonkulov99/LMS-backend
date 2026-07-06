import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseLevel } from '../../types/course';

export class FetchPurchasedCoursesDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    type: 'number',
    format: 'number',
  })
  @IsOptional()
  @IsNumberString()
  category_id?: string;

  @ApiProperty({
    required: false,
    type: 'enum',
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;
}
