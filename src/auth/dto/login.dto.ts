import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+998902400025',
  })
  @IsMobilePhone('uz-UZ')
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
