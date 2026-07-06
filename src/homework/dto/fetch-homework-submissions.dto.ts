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

export class FetchHomeworkSubmissionsDto extends PaginationDto {
  @ApiProperty({ required: false, enum: HomeworkSubStatus })
  @IsOptional()
  @IsEnum(HomeworkSubStatus)
  status?: HomeworkSubStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  course_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  homework_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  user_id?: string;
}
