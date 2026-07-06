import { PartialType } from '@nestjs/swagger';
import { CreateQuestionsDto } from './create-questions.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionsDto) {}
