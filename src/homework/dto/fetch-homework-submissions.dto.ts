import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { HomeworkSubStatus } from '@prisma/client';
import { uzMsg } from '../../global/validation-messages';

export class FetchHomeworkSubmissionsDto extends PaginationDto {
  @ApiProperty({ required: false, enum: HomeworkSubStatus })
  @IsOptional()
  @IsEnum(HomeworkSubStatus, { message: uzMsg.isEnum('Holat') })
  status?: HomeworkSubStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  course_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString({}, { message: uzMsg.isNumberString('Uy vazifasi ID') })
  homework_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString({}, { message: uzMsg.isNumberString('Foydalanuvchi ID') })
  user_id?: string;
}
