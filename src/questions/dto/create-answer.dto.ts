import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class CreateAnswerDto {
  @ApiProperty({
    example: 'You should check syntax first.',
  })
  @IsString({ message: uzMsg.isString('Matn') })
  @MaxLength(2000, { message: uzMsg.maxLength('Matn', 2000) })
  text: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: true,
    format: 'binary',
  })
  file?: any | Express.Multer.File;
}
