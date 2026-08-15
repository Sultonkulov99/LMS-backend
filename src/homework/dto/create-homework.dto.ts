import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class CreateHomeworkDto {
  @ApiProperty({
    example:
      '1. Create Nest.js app\n2. Push it to github\n3. Send github repo link',
  })
  @IsString({ message: uzMsg.isString('Vazifa') })
  @MaxLength(1500, { message: uzMsg.maxLength('Vazifa', 1500) })
  task: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: true,
    format: 'binary',
  })
  file?: any | Express.Multer.File;

  @ApiProperty()
  @IsUUID(undefined, { message: uzMsg.isUUID('Dars ID') })
  lessonId: string;
}
