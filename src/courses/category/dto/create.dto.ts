import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @ApiProperty({
    example: 'Veb dasturlash',
  })
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
