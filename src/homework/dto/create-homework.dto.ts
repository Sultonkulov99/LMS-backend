import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({
    example:
      '1. Create Nest.js app\n2. Push it to github\n3. Send github repo link',
  })
  @IsString()
  @MaxLength(1500)
  task: string;

  @ApiProperty({
    required: false,
    type: 'string',
    nullable: true,
    format: 'binary',
  })
  file?: any | Express.Multer.File;

  @ApiProperty()
  @IsUUID()
  lessonId: string;
}
