import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDateString,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class FetchTestResultsDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsNumberString({}, { message: uzMsg.isNumberString('Guruh ID') })
  @IsOptional()
  lesson_group_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString({}, { message: uzMsg.isNumberString('Foydalanuvchi ID') })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString({ message: uzMsg.isBooleanString("O'tgan holati") })
  @IsOptional()
  passed?: 'true' | 'false';

  @ApiProperty({
    required: false,
    description: 'Format: yyyy-mm-dd',
  })
  @IsDateString({}, { message: uzMsg.isDateString('Sanadan') })
  @IsOptional()
  date_from?: string;

  @ApiProperty({
    required: false,
    description: 'Format: yyyy-mm-dd',
  })
  @IsDateString({}, { message: uzMsg.isDateString('Sanagacha') })
  @IsOptional()
  date_to?: string;
}

export class FetchGroupTestResultsDto extends OmitType(FetchTestResultsDto, [
  'lesson_group_id',
]) {}
