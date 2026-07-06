import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SubmitHomeworkDto {
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(800)
  @IsOptional()
  text?: string;

  @ApiProperty({
    required: true,
    type: 'string',
    nullable: false,
    format: 'binary',
  })
  file: any | Express.Multer.File;
}
