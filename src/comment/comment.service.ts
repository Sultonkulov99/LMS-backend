import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.comment.findMany({
            select: {
                id: true,
                message: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                course: {
                    select: {
                        id: true,
                        name: true
                    }
                },
            }
        })
    }

    async createComment(payload: CreateCommentDto) {
        const [existingStudent, existingCourse] = await this.prisma.$transaction([
            this.prisma.user.findUnique({ where: { id: payload.studentId } }),
            this.prisma.course.findUnique({ where: { id: payload.courseId } }),
        ])

        if (!existingStudent || !existingCourse) {
            throw new NotFoundException("Student yoki Kurs topilmadi")
        }
        await this.prisma.comment.create({ data: payload })

        return {
            success: true,
            message: `${existingCourse.name} uchun izoh yaratildi`
        }
    }

    async updateComment(payload: UpdateCommentDto, id: number) {
        const [existingStudent, existingCourse, existingComment] = await this.prisma.$transaction([
            this.prisma.user.findUnique({ where: { id: payload.studentId } }),
            this.prisma.course.findUnique({ where: { id: payload.courseId } }),
            this.prisma.comment.findUnique({ where: { id } })
        ])

        if (!existingComment) {
            throw new NotFoundException("Izoh topilmadi")
        }

        if (!existingStudent || !existingCourse) {
            throw new NotFoundException("Student yoki Kurs topilmadi")
        }

        await this.prisma.comment.update({ data: payload, where: { id } })

        return {
            success: true,
            message: `${existingCourse.name} ning izohi yangilandi`
        }
    }

    async deleteComment(id: number) {
        const existing = await this.prisma.comment.findUnique({ where: { id } })

        if (!existing) {
            throw new NotFoundException("Izoh topilmadi")
        }

        await this.prisma.comment.delete({ where: { id } })

        return {
            success: true,
            message: "Izoh o'chirildi"
        }
    }
}