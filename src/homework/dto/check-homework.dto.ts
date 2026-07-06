import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CheckHomeworkDto {
  @ApiProperty()
  @IsNumber()
  submissionId: number;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
