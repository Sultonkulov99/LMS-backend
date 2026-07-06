import {
  IsMobilePhone,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({
    example: 'Raupov Manuchehr',
  })
  @IsString()
  @MaxLength(30)
  fullName: string;

  @ApiProperty({
    example: '+998902400025',
  })
  @IsOptional()
  @IsMobilePhone('uz-UZ')
  phone?: string;

  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  })
  @IsString()
  @MaxLength(1000)
  message: string;
}
