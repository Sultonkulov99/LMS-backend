import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, MinLength } from 'class-validator';

export class RegisterSendOtp {
  @ApiProperty({
    example: '+998902400025',
  })
  @IsMobilePhone('uz-UZ')
  @IsString()
  phone: string;
}

export class RegisterVerifyDto extends RegisterSendOtp {
  @ApiProperty({
    example: '000000',
  })
  @IsString()
  otp: string;
}

export class RegisterDto extends RegisterVerifyDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
