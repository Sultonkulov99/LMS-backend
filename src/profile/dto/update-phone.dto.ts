import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString } from 'class-validator';

export class UpdatePhoneDto {
  @ApiProperty({
    example: '000000',
  })
  @IsString()
  otp: string;

  @ApiProperty({
    example: '+998902400025',
  })
  @IsMobilePhone('uz-UZ')
  @IsString()
  phone: string;
}
