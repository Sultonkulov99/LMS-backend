import { PaginationDto } from '../../global/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../types/user';
import { uzMsg } from '../../global/validation-messages';

export class FetchUsersDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: uzMsg.isString('Qidiruv') })
  search: string;

  @ApiProperty({
    required: false,
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: uzMsg.isEnum('Rol') })
  role?: UserRole;
}
