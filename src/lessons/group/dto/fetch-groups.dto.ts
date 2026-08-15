import { PaginationDto } from '../../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { uzMsg } from '../../../global/validation-messages';

export class FetchGroupsDto extends PaginationDto {
  @ApiProperty({
    nullable: true,
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBooleanString({ message: uzMsg.isBooleanString("Darslarni ko'rsatish") })
  include_lessons?: 'true' | 'false';
}
