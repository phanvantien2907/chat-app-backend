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
const chat_service_1 = require("./chat-service");
const chat_dtos_1 = require("./dtos/chat.dtos");
const guards_guard_1 = require("../guards/guards.guard");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getMessages(userId1, userId2, page = '1', pageSize = '50') {
        try {
            const messages = await this.chatService.getMessage(userId1, userId2, parseInt(page), parseInt(pageSize));
            return {
                success: true,
                data: messages.reverse(),
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
            };
        }
    }
    async getUnreadMessages(userId) {
        try {
            const messages = await this.chatService.getUnreadMessages(userId);
            return {
                success: true,
                data: messages,
                count: messages.length,
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
            };
        }
    }
    async markAsRead(body) {
        try {
            await this.chatService.markMessagesAsRead(body.senderId, body.receiverId);
            return {
                success: true,
                message: 'Messages marked as read',
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
            };
        }
    }
    async sendMessage(chatDto) {
        try {
            const savedMessage = await this.chatService.saveMessage(chatDto);
            return {
                success: true,
                data: savedMessage,
                status: common_1.HttpStatus.CREATED,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
            };
        }
    }
    async getMessage(messageId) {
        try {
            const message = await this.chatService.getMessageById(messageId);
            if (!message) {
                return {
                    success: false,
                    message: 'Message not found',
                    status: common_1.HttpStatus.NOT_FOUND,
                };
            }
            return {
                success: true,
                data: message,
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
            };
        }
    }
    async getConversations(userId) {
        try {
            const conversations = await this.chatService.getConversations(userId);
            return {
                success: true,
                data: conversations,
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
            };
        }
    }
    async deleteMessage(messageId, body) {
        try {
            const deleted = await this.chatService.deleteMessage(messageId, body.userId);
            if (!deleted) {
                return {
                    success: false,
                    message: 'Message not found or you do not have permission to delete',
                    status: common_1.HttpStatus.NOT_FOUND,
                };
            }
            return {
                success: true,
                message: 'Message deleted successfully',
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
            };
        }
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('messages/:userId1/:userId2'),
    __param(0, (0, common_1.Param)('userId1')),
    __param(1, (0, common_1.Param)('userId2')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('unread/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUnreadMessages", null);
__decorate([
    (0, common_1.Post)('mark-read'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dtos_1.ChatDTO]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('message/:messageId'),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessage", null);
__decorate([
    (0, common_1.Get)('conversations/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Delete)('message/:messageId'),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('api/chat'),
    (0, common_1.UseGuards)(guards_guard_1.GuardsGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map