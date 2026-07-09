import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import {
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class UpdateMentorDto extends UpdateUserDto {
  @ApiProperty({
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  experience?: number;

  @ApiProperty({
    example: 'Full-stack software engineer',
    required: false,
  })
  @IsOptional()
  @MaxLength(80)
  job?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(2500)
  about?: string;

  @ApiProperty({
    example: 'https://t.me/Sultonqulov99',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  telegram?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl()
  @IsOptional()
  github?: string;

  @ApiProperty({
    required: false,
  })
  @IsUrl()
  @IsOptional()
  website?: string;
}
