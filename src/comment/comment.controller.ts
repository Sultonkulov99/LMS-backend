import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/global/guards/roles.guard";
import { Roles } from "src/global/decorators/roles";
import { UserRole } from "src/types/user";

@ApiTags('Comment')
@Controller('api/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Get()
    async findAll() {
        return this.commentService.findAll()
    }
    
    @ApiOperation({
        summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}, ${UserRole.STUDENT}`,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STUDENT])
    @Post()
    async createComment(@Body() payload: CreateCommentDto) {
        return this.commentService.createComment(payload)
    }
    
    @ApiOperation({
        summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}, ${UserRole.STUDENT}`,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STUDENT])
    @Patch('id')
    async updateComment(@Param('id') id: number, @Body() payload: UpdateCommentDto) {
        return this.commentService.updateComment(payload, id)
    }
    
    @ApiOperation({
        summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}, ${UserRole.STUDENT}`,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STUDENT])
    @Delete('id')
    async deleteComment(@Param('id') id: number) {
        return this.commentService.deleteComment(id)
    }
}