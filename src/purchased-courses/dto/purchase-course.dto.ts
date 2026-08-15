import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, Matches } from 'class-validator';
import { PaidVia } from '@prisma/client';
import { uzMsg } from '../../global/validation-messages';

export class PurchaseCourseDto {
  @ApiProperty()
  @IsString({ message: uzMsg.isString('Kurs ID') })
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  courseId: string;

  // @ApiProperty({
  //   type: 'enum',
  //   enum: PaidVia,
  // })
  // @IsEnum(PaidVia)
  // paidVia: PaidVia;
}

export class CreatePurchaseCourseDto extends PurchaseCourseDto {
  @ApiProperty({
    example: '+998902400005',
  })
  @Matches(/^(\+?998)(20|33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/, {
    message: "Telefon raqami +998XXXXXXXXX yoki 998XXXXXXXXX formatida bo'lishi kerak",
  })
  phone: string;
}
