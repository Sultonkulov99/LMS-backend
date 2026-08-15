import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { uzMsg } from '../../global/validation-messages';

export class UpdateMentorDto extends UpdateUserDto {
  @ApiProperty({
    example: 3,
  })
  @IsNumber({}, { message: uzMsg.isNumber('Tajriba') })
  @IsOptional()
  @Min(1, { message: uzMsg.min('Tajriba', 1) })
  @Max(100, { message: uzMsg.max('Tajriba', 100) })
  experience?: number;

  @ApiProperty({
    example: 'Full-stack software engineer',
    required: false,
  })
  @IsOptional()
  @MaxLength(80, { message: uzMsg.maxLength('Lavozim', 80) })
  job?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(2500, { message: uzMsg.maxLength("O'zi haqida ma'lumot", 2500) })
  about?: string;

  @ApiProperty({
    example: 'https://t.me/Sultonqulov99',
    required: false,
  })
  @IsUrl({}, { message: uzMsg.isUrl('Telegram havolasi') })
  @IsOptional()
  telegram?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl({}, { message: uzMsg.isUrl('Facebook havolasi') })
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl({}, { message: uzMsg.isUrl('Instagram havolasi') })
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl({}, { message: uzMsg.isUrl('LinkedIn havolasi') })
  @IsOptional()
  linkedin?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl({}, { message: uzMsg.isUrl('GitHub havolasi') })
  @IsOptional()
  github?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl({}, { message: uzMsg.isUrl('Veb-sayt havolasi') })
  @IsOptional()
  website?: string;
}
