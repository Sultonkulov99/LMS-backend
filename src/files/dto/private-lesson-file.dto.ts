import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class PrivateLessonFileParamDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  lessonId: string;

  @ApiProperty()
  @IsString()
  name: string;
}
