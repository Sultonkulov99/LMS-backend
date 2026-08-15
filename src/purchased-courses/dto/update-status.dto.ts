import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUUID } from "class-validator";
import { uzMsg } from "../../global/validation-messages";

export class UpdateStatusDto {
  @ApiProperty()
  @IsString({ message: uzMsg.isString('Kurs ID') })
  @IsUUID(undefined, { message: uzMsg.isUUID('Kurs ID') })
  courseId: string;

  @ApiProperty()
  @IsInt({ message: uzMsg.isInt('Foydalanuvchi ID') })
  userId: number;
}