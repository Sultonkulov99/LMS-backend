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
import { uzMsg } from '../../global/validation-messages';

export class FetchPurchasedCoursesDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsString({ message: uzMsg.isString('Qidiruv') })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    type: 'number',
    format: 'number',
  })
  @IsOptional()
  @IsNumberString({}, { message: uzMsg.isNumberString('Kategoriya') })
  category_id?: string;

  @ApiProperty({
    required: false,
    type: 'enum',
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel, { message: uzMsg.isEnum('Daraja') })
  level?: CourseLevel;
}
