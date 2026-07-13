import { OmitType } from '@nestjs/swagger';
import { CreateTestDto } from './create-test.dto';

export class UpdateTestDto extends OmitType(CreateTestDto, ['lessonId']) {}
