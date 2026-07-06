import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @ApiProperty({
    example: 'Veb dasturlash',
  })
  @IsString()
  name: string;
}
