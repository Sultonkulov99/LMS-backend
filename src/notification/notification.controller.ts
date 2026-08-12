// notification/notification.controller.ts
import { Controller, Get, Patch, Param, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('mine')
  findMine(@Req() req, @Query('unread') unread?: string) {
    return this.notificationService.findMine(req.user.id, unread === 'true');
  }

  @Get('mine/count')
  countUnread(@Req() req) {
    return this.notificationService.countUnread(req.user.id);
  }

  @Patch('read/:id')
  markAsRead(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}