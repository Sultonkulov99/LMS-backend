import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateLessonFileDto {
  @ApiProperty({
    required: true,
    type: 'string',
    nullable: false,
    format: 'binary',
  })
  files: any | Express.Multer.File[];

  @ApiProperty()
  @IsString()
  lessonId: string;

  @ApiProperty({
    required: false,
    type: 'json',
    example: '["Just a first note for first file"]',
  })
  @IsJSON()
  @IsOptional()
  notes?: string;
}
