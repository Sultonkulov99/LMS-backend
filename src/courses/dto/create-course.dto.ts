import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { CourseLevel } from '../../types/course';
import { uzMsg } from '../../global/validation-messages';

export class CreateCourseDto {
  @ApiProperty({
    example: 'NestJS ultimate course for absolute beginners',
  })
  @IsString({ message: uzMsg.isString('Kurs nomi') })
  name: string;

  @ApiProperty({
    example: 'Best nodeJS back-end course ever!',
  })
  @IsString({ message: uzMsg.isString("Kurs haqida ma'lumot") })
  @MaxLength(10000, { message: uzMsg.maxLength("Kurs haqida ma'lumot", 10000) })
  about: string;

  @ApiProperty({
    example: 250000,
    format: 'string',
  })
  @IsNumberString({}, { message: uzMsg.isNumberString('Narx') })
  price: number | string;

  @ApiProperty({
    enum: CourseLevel,
  })
  @IsEnum(CourseLevel, { message: uzMsg.isEnum('Daraja') })
  level: CourseLevel;

  @ApiProperty({
    example: 2,
    format: 'string',
  })
  @IsNumberString({}, { message: uzMsg.isNumberString('Kategoriya') })
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
