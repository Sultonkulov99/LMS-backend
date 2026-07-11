import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUUID } from "class-validator";

export class UpdateStatusDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  courseId: string;

  @ApiProperty()
  @IsInt()
  userId: number;
}