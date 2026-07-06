import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';

export class GetQuestionsQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString()
  @IsOptional()
  read?: 'true' | 'false';

  @ApiProperty({
    required: false,
    type: 'boolean',
  })
  @IsBooleanString()
  @IsOptional()
  answered?: 'true' | 'false';
}

export class GetMyQuestionsQueryDto extends GetQuestionsQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsUUID()
  @IsOptional()
  courseId?: string;
}
