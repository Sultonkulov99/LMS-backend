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
import { uzMsg } from '../../../global/validation-messages';

export class RateCourseDto {
  @ApiProperty({
    example: 5,
  })
  @IsIn([1, 2, 3, 4, 5], { message: uzMsg.isIn('Baho', [1, 2, 3, 4, 5]) })
  @IsInt({ message: uzMsg.isInt('Baho') })
  @Max(5, { message: uzMsg.max('Baho', 5) })
  @Min(1, { message: uzMsg.min('Baho', 1) })
  rate: TCourseRate;

  @ApiProperty({
    example: 'Super course ever!',
    description: 'Max: 900',
  })
  @IsString({ message: uzMsg.isString('Izoh') })
  @MaxLength(900, { message: uzMsg.maxLength('Izoh', 900) })
  comment: string;

  @ApiProperty()
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  @IsString({ message: uzMsg.isString('Kurs ID') })
  courseId: string;
}
