import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotIn, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { uzMsg } from '../../global/validation-messages';

export class CourseVideoParamsDto {
  @ApiProperty()
  @IsUUID(undefined, { message: uzMsg.isUUID('Dars ID') })
  @IsString({ message: uzMsg.isString('Dars ID') })
  lessonId: string;

  @ApiProperty()
  @IsString({ message: uzMsg.isString('Video format') })
  @Transform((t) => t.value?.split('.')?.[1])
  @IsIn(['m3u8', 'ts'], { message: uzMsg.isIn('Video format', ['m3u8', 'ts']) })
  hlsf: string;
}
