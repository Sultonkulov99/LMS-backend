import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Roles } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+998912345678' })
  @IsPhoneNumber()
  contact: string;

  @ApiPropertyOptional({ enum: Roles })
  @IsEnum(Roles)
  role: Roles;

  @ApiProperty()
  @IsString()
  password:string

}
