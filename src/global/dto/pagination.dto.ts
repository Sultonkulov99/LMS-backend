import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { uzMsg } from '../validation-messages';

export class PaginationDto {
  @ApiProperty({
    example: 0,
    required: false,
  })
  @IsNumberString({}, { message: uzMsg.isNumberString('Offset') })
  @IsOptional()
  offset?: string;

  @ApiProperty({
    example: 8,
    required: false,
  })
  @IsNumberString({}, { message: uzMsg.isNumberString('Limit') })
  @IsOptional()
  limit?: string;
}
