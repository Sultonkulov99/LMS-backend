import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { TCourseRate } from '../../../types/course';

export class RateCourseDto {
  @ApiProperty({
    example: 5,
  })
  @IsIn([1, 2, 3, 4, 5])
  @IsInt()
  @Max(5)
  @Min(1)
  rate: TCourseRate;

  @ApiProperty({
    example: 'Super course ever!',
    description: 'Max: 900',
  })
  @IsString()
  @MaxLength(900)
  comment: string;

  @ApiProperty()
  @IsUUID()
  @IsString()
  courseId: string;
}
