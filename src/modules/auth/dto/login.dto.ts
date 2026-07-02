import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+998901234567 yoki ali@example.com',
    description: 'Email yoki contact raqamini kiriting',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'Superadmin@123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
