import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Introduction',
  })
  @IsString({ message: uzMsg.isString('Dars nomi') })
  name: string;

  @ApiProperty({
    example: 'About this lesson',
  })
  @IsString({ message: uzMsg.isString("Dars haqida ma'lumot") })
  @MaxLength(10000, { message: uzMsg.maxLength("Dars haqida ma'lumot", 10000) })
  about: string;

  @ApiProperty()
  @IsNumberString({}, { message: uzMsg.isNumberString('Guruh ID') })
  groupId: string;

  @ApiProperty({required: false})
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl({}, { message: uzMsg.isUrl('Youtube havolasi') })
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
