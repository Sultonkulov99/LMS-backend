import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TestAnswer } from '@prisma/client';
import { Type } from 'class-transformer';

class AnswerTestItemDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({
    enum: TestAnswer,
    example: TestAnswer.variantC,
  })
  @IsEnum(TestAnswer)
  answer: TestAnswer;
}

export class AnswerTestDto {
  @ApiProperty()
  @IsString()
  lessonId: string;

  @ApiProperty({
    isArray: true,
    example: [
      {
        id: 1,
        answer: TestAnswer.variantC,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AnswerTestItemDto)
  answers: AnswerTestItemDto[];
}
