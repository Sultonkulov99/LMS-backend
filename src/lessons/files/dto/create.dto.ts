import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

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
    type: 'string',
    example: '["Just a first note for first file"]',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })
  notes?: string[];
}
