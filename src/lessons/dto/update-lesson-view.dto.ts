import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateLessonViewDto {
  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  @IsBoolean()
  view: boolean;
}
