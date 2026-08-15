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
import { uzMsg } from '../../global/validation-messages';

class AnswerTestItemDto {
  @ApiProperty()
  @IsNumber({}, { message: uzMsg.isNumber('Savol ID') })
  id: number;

  @ApiProperty({
    enum: TestAnswer,
    example: TestAnswer.variantC,
  })
  @IsEnum(TestAnswer, { message: uzMsg.isEnum('Javob') })
  answer: TestAnswer;
}

export class AnswerTestDto {
  @ApiProperty()
  @IsString({ message: uzMsg.isString('Dars ID') })
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
  @IsArray({ message: uzMsg.isArray('Javoblar') })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: uzMsg.arrayMinSize('Javoblar', 1) })
  @Type(() => AnswerTestItemDto)
  answers: AnswerTestItemDto[];
}
