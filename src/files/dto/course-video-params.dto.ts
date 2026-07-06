import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotIn, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CourseVideoParamsDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  lessonId: string;

  @ApiProperty()
  @IsString()
  @Transform((t) => t.value?.split('.')?.[1])
  @IsIn(['m3u8', 'ts'])
  hlsf: string;
}
