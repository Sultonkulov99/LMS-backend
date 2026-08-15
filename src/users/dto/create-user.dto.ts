import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class CreateUserDto {
  @ApiProperty({
    example: '+998902400025',
  })
  @Matches(/^(\+?998)(20|33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/, {
    message: "Telefon raqami +998XXXXXXXXX yoki 998XXXXXXXXX formatida bo'lishi kerak",
  })
  @IsString({ message: uzMsg.isString('Telefon raqami') })
  phone: string;

  @ApiProperty({
    example: 'Adminov Adminjon',
  })
  @IsString({ message: uzMsg.isString("To'liq ism") })
  @MinLength(3, { message: uzMsg.minLength("To'liq ism", 3) })
  fullName: string;

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Parol') })
  @MinLength(8, { message: uzMsg.minLength('Parol', 8) })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Status, { message: uzMsg.isEnum('Holat') })
  status: Status;
}
