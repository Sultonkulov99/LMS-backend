import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TestAnswer } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { uzMsg } from '../../global/validation-messages';

export class CreateTestDto {
  @ApiProperty({
    example: 'What does DOM mean in JavaScript?',
  })
  @IsString({ message: uzMsg.isString('Savol') })
  @MaxLength(800, { message: uzMsg.maxLength('Savol', 800) })
  question: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: true,
    format: 'binary',
  })
  @IsOptional()
  image: any;

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Dars ID') })
  lessonId: string;

  @ApiProperty({
    example: 'Direct Object Module',
  })
  @IsString({ message: uzMsg.isString('A varianti') })
  @MaxLength(400, { message: uzMsg.maxLength('A varianti', 400) })
  variantA: string;

  @ApiProperty({
    example: 'Digital Object Module',
  })
  @IsString({ message: uzMsg.isString('B varianti') })
  @MaxLength(400, { message: uzMsg.maxLength('B varianti', 400) })
  variantB: string;

  @ApiProperty({
    example: 'Document Object Model',
  })
  @IsString({ message: uzMsg.isString('C varianti') })
  @MaxLength(400, { message: uzMsg.maxLength('C varianti', 400) })
  variantC: string;

  @ApiProperty({
    example: 'Document Object Module',
  })
  @IsString({ message: uzMsg.isString('D varianti') })
  @MaxLength(400, { message: uzMsg.maxLength('D varianti', 400) })
  variantD: string;

  @ApiProperty({
    enum: TestAnswer,
    example: TestAnswer.variantC,
  })
  @IsEnum(TestAnswer, { message: uzMsg.isEnum("To'g'ri javob") })
  answer: TestAnswer;
}

export class CreateManyTestDto {
  @ApiProperty()
  @IsString({ message: uzMsg.isString('Dars ID') })
  lessonId: string;

  @ApiProperty({
    isArray: true,
    example: [
      {
        image: 'question.png (OPTIONAL)',
        question: 'What does DOM mean in JavaScript?',
        variantA: 'Direct Object Module',
        variantB: 'Document Object Model',
        variantC: 'Document Object Model',
        variantD: 'Document Object Module',
        answer: 'variantC',
      },
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsArray({ message: uzMsg.isArray('Testlar') })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: uzMsg.arrayMinSize('Testlar', 1) })
  @Type(() => OmitType(CreateTestDto, ['lessonId']))
  tests: Omit<CreateTestDto, 'lessonId'>[];
}
