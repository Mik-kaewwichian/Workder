import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto, StartConversationDto } from './chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    // Start (or fetch existing) conversation about a job
    @Post('conversations')
    start(@Body() dto: StartConversationDto) {
        return this.chatService.startConversation(dto);
    }

    // List all conversations for a user (as employer or worker)
    @Get('conversations')
    list(@Query('userId', ParseIntPipe) userId: number) {
        return this.chatService.getConversations(userId);
    }

    // Cheap count of all unread incoming messages (used by Navbar badge)
    @Get('unread-count')
    unread(@Query('userId', ParseIntPipe) userId: number) {
        return this.chatService.unreadCount(userId);
    }

    // Get one conversation's messages (also marks them read for this user)
    @Get('conversations/:id')
    messages(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseIntPipe) userId: number,
    ) {
        return this.chatService.getMessages(id, userId);
    }

    // Send a message
    @Post('messages')
    send(@Body() dto: SendMessageDto) {
        return this.chatService.sendMessage(dto);
    }
}
