import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 0,
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  offset?: string;

  @ApiProperty({
    example: 8,
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  limit?: string;
}
