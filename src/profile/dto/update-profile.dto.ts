import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class UpdateProfileDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: uzMsg.isString("To'liq ism") })
  fullName?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: false,
    format: 'binary',
  })
  image?: any;
}
