import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, MaxLength } from 'class-validator';

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

  @ApiProperty({
    required: true,
    type: 'string',
    nullable: false,
    format: 'binary',
  })
  video: any | Express.Multer.File;
}
