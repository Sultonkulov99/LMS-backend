import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

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
