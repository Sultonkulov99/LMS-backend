import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '+998902400025',
  })
  @IsMobilePhone('uz-UZ')
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'Adminov Adminjon',
  })
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;
}
