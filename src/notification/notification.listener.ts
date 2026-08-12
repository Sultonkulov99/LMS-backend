import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/core/database/prisma.service';

interface QuestionCreatedPayload {
  id: number;
  userId: number; // savol bergan student
  courseId: string;
  text: string;
}

interface QuestionAnsweredPayload {
  questionId: number;
  courseId: string;
  answeredByUserId: number;
  studentUserId: number; // Question.userId — kimga javob berilyapti
  text: string;
}

@Injectable()
export class NotificationListener {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  @OnEvent('question.created')
  async handleQuestionCreated(payload: QuestionCreatedPayload) {
    const course = await this.prisma.course.findUnique({
      where: { id: payload.courseId },
      select: {
        mentorId: true,
        name: true,
        assistants: { select: { userId: true } },
      },
    });
    if (!course) return;

    const recipients = [
      course.mentorId,
      ...course.assistants.map((a) => a.userId),
    ].filter((id) => id !== payload.userId); // o'ziga o'zi yubormasin

    if (recipients.length === 0) return;

    await this.notificationService.createMany(recipients, {
      type: 'NEW_QUESTION',
      message: `"${course.name}" kursi bo'yicha yangi savol keldi`,
      entityType: 'question',
      // courseId + questionId birga saqlanadi — frontend to'g'ridan-to'g'ri
      // kerakli kursni tanlab, savolni ochishi uchun
      entityId: `${payload.courseId}:${payload.id}`,
    });
  }

  @OnEvent('question.answered')
  async handleQuestionAnswered(payload: QuestionAnsweredPayload) {
    if (payload.studentUserId === payload.answeredByUserId) return;

    await this.notificationService.create({
      userId: payload.studentUserId,
      type: 'NEW_ANSWER',
      message: `Savolingizga javob keldi`,
      entityType: 'question',
      entityId: `${payload.courseId}:${payload.questionId}`,
    });
  }
}