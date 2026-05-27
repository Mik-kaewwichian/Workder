"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_dto_1 = require("./chat.dto");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    // Start (or fetch existing) conversation about a job
    start(dto) {
        return this.chatService.startConversation(dto);
    }
    // List all conversations for a user (as employer or worker)
    list(userId) {
        return this.chatService.getConversations(userId);
    }
    // Cheap count of all unread incoming messages (used by Navbar badge)
    unread(userId) {
        return this.chatService.unreadCount(userId);
    }
    // Get one conversation's messages (also marks them read for this user)
    messages(id, userId) {
        return this.chatService.getMessages(id, userId);
    }
    // Send a message
    send(dto) {
        return this.chatService.sendMessage(dto);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('conversations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.StartConversationDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "start", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Query)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, common_1.Query)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "unread", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "messages", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "send", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
