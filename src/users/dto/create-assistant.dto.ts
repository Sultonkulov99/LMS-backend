import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, IsUUID, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateAssistantDto extends CreateUserDto {
  @ApiProperty()
  @IsUUID()
  courseId: string;
}
