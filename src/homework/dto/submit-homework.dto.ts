import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class SubmitHomeworkDto {
  @ApiProperty({ required: false })
  @IsString({ message: uzMsg.isString('Matn') })
  @MaxLength(800, { message: uzMsg.maxLength('Matn', 800) })
  @IsOptional()
  text?: string;

  @ApiProperty({
    required: true,
    type: 'string',
    nullable: false,
    format: 'binary',
  })
  file: any | Express.Multer.File;
}
