import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUrl, IsUUID } from 'class-validator';

export class SetLastActivityDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID()
  lessonId?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;
}
