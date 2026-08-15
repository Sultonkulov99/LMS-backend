import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { uzMsg } from '../../global/validation-messages';

export class AssignCourseDto {
  @ApiProperty()
  @IsNumber({}, { message: uzMsg.isNumber('Yordamchi (assistant) ID') })
  assistantId: number;

  @ApiProperty()
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  courseId: string;
}
