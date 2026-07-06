import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateExamDto {
  @ApiProperty({
    example: 'What does DOM mean in JavaScript?',
  })
  @IsString()
  @MaxLength(800)
  question: string;

  @ApiProperty()
  @IsNumber()
  lessonGroupId: number;

  @ApiProperty({
    example: 'Direct Object Module',
  })
  @IsString()
  @MaxLength(400)
  variantA: string;

  @ApiProperty({
    example: 'Digital Object Module',
  })
  @IsString()
  @MaxLength(400)
  variantB: string;

  @ApiProperty({
    example: 'Document Object Model',
  })
  @IsString()
  @MaxLength(400)
  variantC: string;

  @ApiProperty({
    example: 'Document Object Module',
  })
  @IsString()
  @MaxLength(400)
  variantD: string;

  @ApiProperty({
    enum: ExamAnswer,
    example: ExamAnswer.variantC,
  })
  @IsEnum(ExamAnswer)
  answer: ExamAnswer;
}

export class CreateManyExamDto {
  @ApiProperty()
  @IsNumber()
  lessonGroupId: number;

  @ApiProperty({
    isArray: true,
    example: [
      {
        question: 'What does DOM mean in JavaScript?',
        variantA: 'Direct Object Module',
        variantB: 'Document Object Model',
        variantC: 'Document Object Model',
        variantD: 'Document Object Module',
        answer: 'variantC',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OmitType(CreateExamDto, ['lessonGroupId']))
  exams: Omit<CreateExamDto, 'lessonGroupId'>[];
}
