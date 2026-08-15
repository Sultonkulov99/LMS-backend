import { ApiProperty } from '@nestjs/swagger';
import {  IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { uzMsg } from '../../global/validation-messages';

export class CreateAssistantDto extends CreateUserDto {
  @ApiProperty()
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  courseId: string;
}
