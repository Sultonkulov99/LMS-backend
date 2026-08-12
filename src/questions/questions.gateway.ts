import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTAccessOptions } from '../global/config/jwt';
import { PrismaService } from 'src/core/database/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/questions',
})
export class QuestionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('QuestionsGateway');

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
      this.logger.log(`Client connected: ${user.fullName} (${user.role})`);
    } catch (err) {
      this.logger.warn(`Connection rejected: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinCourseRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { courseId: string },
  ) {
    const room = `course:${data.courseId}`;
    client.join(room);
    return { event: 'joinedRoom', data: room };
  }

  @SubscribeMessage('leaveCourseRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { courseId: string },
  ) {
    const room = `course:${data.courseId}`;
    client.leave(room);
  }

  // Bu metodlarni QuestionsService chaqiradi
  emitNewQuestion(courseId: string, question: any) {
    this.server.to(`course:${courseId}`).emit('newQuestion', question);
  }

  emitNewAnswer(courseId: string, userId: number, answer: any) {
    this.server.to(`course:${courseId}`).emit('newAnswer', answer);
    // Shaxsiy xabar sifatida ham yuborish mumkin (agar user o'z ID room'iga qo'shilgan bo'lsa)
    this.server.to(`user:${userId}`).emit('newAnswer', answer);
  }
}