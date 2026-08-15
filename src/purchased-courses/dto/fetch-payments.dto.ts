import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';
import { uzMsg } from '../../global/validation-messages';

export class FetchPaymentsDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsString({ message: uzMsg.isString('Qidiruv') })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, enum: PaymentStatus })
  @IsEnum(PaymentStatus, { message: uzMsg.isEnum('Holat') })
  @IsOptional()
  status?: PaymentStatus;
}
