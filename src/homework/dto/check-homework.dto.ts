import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class CheckHomeworkDto {
  @ApiProperty()
  @IsNumber({}, { message: uzMsg.isNumber('Topshiriq ID') })
  submissionId: number;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean({ message: uzMsg.isBoolean('Tasdiqlangan holati') })
  approved: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString({ message: uzMsg.isString('Sabab') })
  @MaxLength(1000, { message: uzMsg.maxLength('Sabab', 1000) })
  reason?: string;
}
