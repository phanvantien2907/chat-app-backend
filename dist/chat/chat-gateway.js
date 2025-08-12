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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat-service");
const common_1 = require("@nestjs/common");
const chat_dtos_1 = require("./dtos/chat.dtos");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    userConnections = new Map();
    constructor(chatService) {
        this.chatService = chatService;
    }
    async handleConnection(client) {
        try {
            const userId = this.extractUserIdFromSocket(client);
            if (userId) {
                client.userId = userId;
                this.userConnections.set(userId, client.id);
                await client.join(`user_${userId}`);
                client.broadcast.emit('userOnline', { userId });
                const unreadMessages = await this.chatService.getUnreadMessages(userId);
                if (unreadMessages.length > 0) {
                    client.emit('unreadMessages', unreadMessages);
                }
                this.logger.log(`User ${userId} connected with socket ${client.id}`);
            }
        }
        catch (error) {
            this.logger.error('Connection error:', error);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        if (client.userId) {
            this.userConnections.delete(client.userId);
            client.broadcast.emit('userOffline', { userId: client.userId });
            this.logger.log(`User ${client.userId} disconnected`);
        }
    }
    async handleSendMessage(data, client) {
        try {
            if (client.userId !== data.senderId) {
                client.emit('error', { message: 'Invalid sender ID' });
                return;
            }
            const savedMessage = await this.chatService.saveMessage(data);
            const receiverSocketId = this.userConnections.get(data.receiverId);
            if (receiverSocketId) {
                this.server.to(`user_${data.receiverId}`).emit('receiveMessage', savedMessage);
            }
            client.emit('messageSent', savedMessage);
            this.logger.log(`Message sent from ${data.senderId} to ${data.receiverId}`);
        }
        catch (error) {
            this.logger.error('Send message error:', error);
            client.emit('error', { message: 'Failed to send message' });
        }
    }
    async handleJoinConversation(data, client) {
        try {
            if (!client.userId)
                return;
            const conversationRoom = this.getConversationId(client.userId, data.otherUserId);
            await client.join(conversationRoom);
            await this.chatService.markMessagesAsRead(data.otherUserId, client.userId);
            const messages = await this.chatService.getMessage(client.userId, data.otherUserId);
            client.emit('conversationHistory', messages.reverse());
            const senderSocketId = this.userConnections.get(data.otherUserId);
            if (senderSocketId) {
                this.server.to(`user_${data.otherUserId}`).emit('messagesRead', { userId: client.userId });
            }
            this.logger.log(`User ${client.userId} joined conversation with ${data.otherUserId}`);
        }
        catch (error) {
            this.logger.error('Join conversation error:', error);
            client.emit('error', { message: 'Failed to join conversation' });
        }
    }
    async handleLeaveConversation(data, client) {
        try {
            if (!client.userId)
                return;
            const conversationRoom = this.getConversationId(client.userId, data.otherUserId);
            await client.leave(conversationRoom);
            this.logger.log(`User ${client.userId} left conversation with ${data.otherUserId}`);
        }
        catch (error) {
            this.logger.error('Leave conversation error:', error);
        }
    }
    async handleMarkAsRead(data, client) {
        try {
            if (!client.userId)
                return;
            await this.chatService.markMessagesAsRead(data.senderId, client.userId);
            const senderSocketId = this.userConnections.get(data.senderId);
            if (senderSocketId) {
                this.server.to(`user_${data.senderId}`).emit('messagesRead', { userId: client.userId });
            }
            this.logger.log(`Messages marked as read by ${client.userId} from ${data.senderId}`);
        }
        catch (error) {
            this.logger.error('Mark as read error:', error);
            client.emit('error', { message: 'Failed to mark messages as read' });
        }
    }
    async handleGetOnlineUsers(client) {
        const onlineUserIds = Array.from(this.userConnections.keys());
        client.emit('onlineUsers', onlineUserIds);
    }
    async handleTyping(data, client) {
        if (!client.userId)
            return;
        const receiverSocketId = this.userConnections.get(data.receiverId);
        if (receiverSocketId) {
            this.server.to(`user_${data.receiverId}`).emit('userTyping', {
                userId: client.userId,
                isTyping: data.isTyping
            });
        }
    }
    extractUserIdFromSocket(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            return userId;
        }
        const token = client.handshake.auth?.token || client.handshake.headers.authorization;
        if (token) {
            try {
                const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
                return payload.sub || payload.userId || payload.id;
            }
            catch (error) {
                this.logger.error('Error decoding token:', error);
            }
        }
        return null;
    }
    getConversationId(userId1, userId2) {
        const sortedIds = [userId1, userId2].sort();
        return `conversation_${sortedIds[0]}_${sortedIds[1]}`;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dtos_1.ChatDTO, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineUsers'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:4200',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat-gateway.js.map