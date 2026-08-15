import { IsJWT, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { uzMsg } from '../../global/validation-messages';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString({ message: uzMsg.isString('Token') })
  @IsJWT({ message: uzMsg.isJWT('Token') })
  token: string;
}
