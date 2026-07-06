import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLessonGroupDto {
  @ApiProperty({
    example: 'Kirish',
  })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  courseId: string;
}
