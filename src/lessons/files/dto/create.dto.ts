import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { uzMsg } from '../../../global/validation-messages';

export class CreateLessonFileDto {
  @ApiProperty({
    required: true,
    nullable: false,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary'
    },
    description: 'Bitta yoki bir nechta fayllarni tanlang',
  })
  files: any | Express.Multer.File[];

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Dars ID') })
  lessonId: string;

  @ApiProperty({
    required: false,
    type: 'string',
    example: '["Just a first note for first file"]',
  })
  @IsOptional()
  @IsArray({ message: uzMsg.isArray('Izohlar') })
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
