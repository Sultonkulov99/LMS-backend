import { CreateMentorDto } from '../../users/dto/create-mentor.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateMentorProfileDto extends PartialType(
  OmitType(CreateMentorDto, ['phone', 'password', 'fullName']),
) {}
