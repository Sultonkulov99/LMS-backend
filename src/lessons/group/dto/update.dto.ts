import { CreateLessonGroupDto } from './create.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateLessonGroupDto extends OmitType(CreateLessonGroupDto, [
  'courseId',
]) {}
