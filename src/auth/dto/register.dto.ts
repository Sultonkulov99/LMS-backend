import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class RegisterSendOtp {
  @ApiProperty({
    example: '+998902400025',
  })
  @Matches(/^(\+?998)(20|33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/, {
    message: "Telefon raqami +998XXXXXXXXX yoki 998XXXXXXXXX formatida bo'lishi kerak",
  })
  @IsString({ message: uzMsg.isString('Telefon raqami') })
  phone: string;
}

export class RegisterVerifyDto extends RegisterSendOtp {
  @ApiProperty({
    example: '000000',
  })
  @IsString({ message: uzMsg.isString("Tasdiqlash kodi (OTP)") })
  otp: string;
}

export class RegisterDto extends RegisterVerifyDto {
  @ApiProperty()
  @IsString({ message: uzMsg.isString("To'liq ism") })
  fullName: string;

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Parol') })
  @MinLength(8, { message: uzMsg.minLength('Parol', 8) })
  password: string;
}
