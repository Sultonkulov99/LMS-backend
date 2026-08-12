import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationGateway } from './notification.gateway';

interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  message: string;
  entityType?: string;
  entityId?: number | string;
}

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(input: CreateNotificationInput) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        message: input.message,
        entityType: input.entityType,
        entityId: input.entityId?.toString(),
      },
    });
    this.notificationGateway.emitToUser(input.userId, notification);
    return notification;
  }

  // Bir nechta userga bir vaqtda (masalan mentor + barcha assistentlar)
  async createMany(userIds: number[], data: Omit<CreateNotificationInput, 'userId'>) {
    const unique = [...new Set(userIds)];
    const result = await this.prisma.notification.createMany({
      data: unique.map((userId) => ({
        userId,
        type: data.type,
        message: data.message,
        entityType: data.entityType,
        entityId: data.entityId?.toString(),
      })),
    });

    // createMany qaytargan yozuvlarni o'zi bermaydi, shuning uchun
    // har bir foydalanuvchiga alohida push qilish uchun eng so'nggi yozuvlarni topamiz
    const created = await this.prisma.notification.findMany({
      where: {
        userId: { in: unique },
        entityType: data.entityType,
        entityId: data.entityId?.toString(),
      },
      orderBy: { createdAt: 'desc' },
      take: unique.length,
    });

    for (const notification of created) {
      this.notificationGateway.emitToUser(notification.userId, notification);
    }

    return result;
  }

  findMine(userId: number, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { read: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  countUnread(userId: number) {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }

  async markAsRead(id: number, userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId }, // faqat o'ziniki, boshqa userniki emas
      data: { read: true, readAt: new Date() },
    });
    return result;
  }

  markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    });
  }
}