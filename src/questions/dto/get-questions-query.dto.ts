import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class GetQuestionsQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString({ message: uzMsg.isBooleanString("O'qilgan holati") })
  @IsOptional()
  read?: 'true' | 'false';

  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString({ message: uzMsg.isBooleanString('Javob berilgan holati') })
  @IsOptional()
  answered?: 'true' | 'false';
}

export class GetMyQuestionsQueryDto extends GetQuestionsQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  @IsOptional()
  courseId?: string;
}
