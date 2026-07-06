import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';

class AnswerExamItemDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({
    enum: ExamAnswer,
    example: ExamAnswer.variantC,
  })
  @IsEnum(ExamAnswer)
  answer: ExamAnswer;
}

export class AnswerExamDto {
  @ApiProperty()
  @IsNumber()
  lessonGroupId: number;

  @ApiProperty({
    isArray: true,
    example: [
      {
        id: 1,
        answer: ExamAnswer.variantC,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AnswerExamItemDto)
  answers: AnswerExamItemDto[];
}
