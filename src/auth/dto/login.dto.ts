import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+998902400025',
  })
  @Matches(/^(\+?998)(20|33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/, {
    message: "Telefon raqami +998XXXXXXXXX yoki 998XXXXXXXXX formatida bo'lishi kerak",
  })
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
