import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateCourseMentorDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  courseId: string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
