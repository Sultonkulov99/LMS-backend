import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class FetchCourseStudentsDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsString({ message: uzMsg.isString('Qidiruv') })
  @IsOptional()
  search?: string;
}
