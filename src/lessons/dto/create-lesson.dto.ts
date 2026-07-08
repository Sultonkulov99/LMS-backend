import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Introduction',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'About this lesson',
  })
  @IsString()
  @MaxLength(10000)
  about: string;

  @ApiProperty()
  @IsNumberString()
  groupId: string;

  @ApiProperty({required: false})
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl()
  @IsOptional()
  youtube_link?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: false,
    format: 'binary',
  })
  video: any | Express.Multer.File;
}
