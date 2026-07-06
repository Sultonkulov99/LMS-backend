import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCourseDto {
  @ApiProperty()
  @IsNumber()
  assistantId: number;

  @ApiProperty()
  @IsUUID()
  courseId: string;
}
