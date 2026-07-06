import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMobilePhone, IsString, IsUUID } from 'class-validator';
import { PaidVia } from '@prisma/client';

export class PurchaseCourseDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
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
  @IsMobilePhone('uz-UZ')
  phone: string;
}
