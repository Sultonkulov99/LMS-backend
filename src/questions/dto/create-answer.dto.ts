import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    example: 'You should check syntax first.',
  })
  @IsString()
  @MaxLength(2000)
  text: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: true,
    format: 'binary',
  })
  file?: any | Express.Multer.File;
}
