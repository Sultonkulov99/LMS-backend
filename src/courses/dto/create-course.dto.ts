import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { CourseLevel } from '../../types/course';

export class CreateCourseDto {
  @ApiProperty({
    example: 'NestJS ultimate course for absolute beginners',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Best nodeJS back-end course ever!',
  })
  @IsString()
  @MaxLength(10000)
  about: string;

  @ApiProperty({
    example: 250000,
    format: 'string',
  })
  @IsNumberString()
  price: number | string;

  @ApiProperty({
    enum: CourseLevel,
  })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({
    example: 2,
    format: 'string',
  })
  @IsNumberString()
  categoryId: string | number;

  @ApiProperty({
    required: true,
    type: 'string',
    nullable: false,
    format: 'binary',
  })
  banner: any;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: true,
    format: 'binary',
  })
  introVideo?: any;
}
