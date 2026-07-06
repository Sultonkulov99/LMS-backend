import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateQuestionsDto {
  @ApiProperty({
    example:
      "I did everything like you shown, but it isn't working please help me.",
  })
  @IsString()
  @MaxLength(1200)
  text: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: true,
    format: 'binary',
  })
  file?: any | Express.Multer.File;
}
