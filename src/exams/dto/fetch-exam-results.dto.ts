import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDate,
  IsDateString,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class FetchExamResultsDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  lesson_group_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString()
  @IsOptional()
  passed?: 'true' | 'false';

  @ApiProperty({
    required: false,
    description: 'Format: yyyy-mm-dd',
  })
  @IsDateString()
  @IsOptional()
  date_from?: string;

  @ApiProperty({
    required: false,
    description: 'Format: yyyy-mm-dd',
  })
  @IsDateString()
  @IsOptional()
  date_to?: string;
}

export class FetchGroupExamResultsDto extends OmitType(FetchExamResultsDto, [
  'lesson_group_id',
]) {}
