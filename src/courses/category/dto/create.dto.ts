import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { uzMsg } from '../../../global/validation-messages';

export class CreateCourseCategoryDto {
  @ApiProperty({
    example: 'Veb dasturlash',
  })
  @IsString({ message: uzMsg.isString('Kategoriya nomi') })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Status, { message: uzMsg.isEnum('Holat') })
  status: Status;
}
