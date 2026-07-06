import { OmitType } from '@nestjs/swagger';
import { CreateExamDto } from './create-exam.dto';

export class UpdateExamDto extends OmitType(CreateExamDto, ['lessonGroupId']) {}
