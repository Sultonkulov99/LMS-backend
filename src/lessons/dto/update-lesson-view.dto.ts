import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { uzMsg } from '../../global/validation-messages';

export class UpdateLessonViewDto {
  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  @IsBoolean({ message: uzMsg.isBoolean("Ko'rilgan holati") })
  view: boolean;
}
