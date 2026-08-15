import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTAccessOptions } from '../global/config/jwt';
import { PrismaService } from 'src/core/database/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationGateway');

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) throw new UnauthorizedException();

      const payload = this.jwtService.verify(token, {
        secret: JWTAccessOptions.secret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, role: true, fullName: true },
      });

      if (!user) throw new UnauthorizedException();

      client.data.user = user;
      // Har bir foydalanuvchi o'zining shaxsiy xonasiga avtomatik qo'shiladi —
      // shu orqali NotificationService to'g'ridan-to'g'ri unga signal yubora oladi.
      client.join(`user:${user.id}`);
      this.logger.log(
        `Notification socket connected: ${user.fullName} (${user.role})`,
      );
    } catch (err) {
      this.logger.warn(`Connection rejected: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Notification socket disconnected: ${client.id}`);
  }

  // NotificationService shu metodni chaqiradi — DB'ga yozilgandan keyin darhol push qiladi
  emitToUser(userId: number, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }
}