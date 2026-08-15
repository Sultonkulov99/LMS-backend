import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { uzMsg } from '../../../global/validation-messages';

export class CreateLessonGroupDto {
  @ApiProperty({
    example: 'Kirish',
  })
  @IsString({ message: uzMsg.isString('Guruh nomi') })
  name: string;

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Kurs ID') })
  courseId: string;
}
