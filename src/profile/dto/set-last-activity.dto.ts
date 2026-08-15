import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUrl, IsUUID } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class SetLastActivityDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  courseId?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: uzMsg.isNumber('Guruh ID') })
  groupId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUUID(undefined, { message: uzMsg.isUUID('Dars ID') })
  lessonId?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: uzMsg.isUrl('URL manzil') })
  url?: string;
}
