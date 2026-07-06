import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone } from 'class-validator';

export class FetchUserByPhoneParamsDto {
  @ApiProperty({
    example: '+998902400025',
  })
  @IsMobilePhone('uz-UZ')
  phone: string;
}
