import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString({ message: uzMsg.isString('Parol') })
  @MinLength(8, { message: uzMsg.minLength('Parol', 8) })
  password: string;

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Yangi parol') })
  @MinLength(8, { message: uzMsg.minLength('Yangi parol', 8) })
  newPassword: string;
}
