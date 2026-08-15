import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationListener } from './notification.listener';
import { NotificationGateway } from './notification.gateway';
import { PrismaModule } from 'src/core/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationListener,
    NotificationGateway,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}