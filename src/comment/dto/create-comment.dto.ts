import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";
import { uzMsg } from "src/global/validation-messages";

export class CreateCommentDto {
    @ApiProperty({
        example: 'Yaxshi Kurs',
    })
    @IsString({ message: uzMsg.isString("Xabar")})
    message: string;
    
    @ApiProperty({})
    @IsString({ message: uzMsg.isString("Course_Id")})
    courseId: string;
    
    @ApiProperty({})
    @IsInt({ message: uzMsg.isString("Student_Id")})
    studentId: number;
}