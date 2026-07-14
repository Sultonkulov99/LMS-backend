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
import { TestAnswer } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateTestDto {
  @ApiProperty({
    example: 'What does DOM mean in JavaScript?',
  })
  @IsString()
  @MaxLength(800)
  question: string;

  @ApiProperty()
  @IsString()
  lessonId: string;

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
    enum: TestAnswer,
    example: TestAnswer.variantC,
  })
  @IsEnum(TestAnswer)
  answer: TestAnswer;
}

export class CreateManyTestDto {
  @ApiProperty()
  @IsString()
  lessonId: string;

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
  @Type(() => OmitType(CreateTestDto, ['lessonId']))
  tests: Omit<CreateTestDto, 'lessonId'>[];
}
