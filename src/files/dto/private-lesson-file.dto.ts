import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class PrivateLessonFileParamDto {
  @ApiProperty()
  @IsUUID(undefined, { message: uzMsg.isUUID('Dars ID') })
  @IsString({ message: uzMsg.isString('Dars ID') })
  lessonId: string;

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Fayl nomi') })
  name: string;
}
