import { PaginationDto } from '../../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

export class FetchGroupsDto extends PaginationDto {
  @ApiProperty({
    nullable: true,
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBooleanString()
  include_lessons?: 'true' | 'false';
}
