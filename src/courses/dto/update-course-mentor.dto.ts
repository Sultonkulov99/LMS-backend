import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class UpdateCourseMentorDto {
  @ApiProperty()
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  @IsString({ message: uzMsg.isString('Kurs ID') })
  courseId: string;

  @ApiProperty()
  @IsNumber({}, { message: uzMsg.isNumber('Foydalanuvchi ID') })
  userId: number;
}
