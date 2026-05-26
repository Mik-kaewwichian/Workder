import { Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly svc: NotificationsService) {}

    @Get()
    list(@CurrentUserId() userId: number) {
        return this.svc.listForUser(userId);
    }

    @Get('unread-count')
    unread(@CurrentUserId() userId: number) {
        return this.svc.unreadCount(userId);
    }

    @Patch(':id/read')
    read(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.svc.markRead(userId, id);
    }

    @Post('read-all')
    readAll(@CurrentUserId() userId: number) {
        return this.svc.markAllRead(userId);
    }
}
