import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat-service';
import { Logger } from '@nestjs/common';
import { ChatDTO } from 'src/chat/dtos/chat.dtos';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userConnections = new Map<string, string>(); // userId -> socketId

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const userId = this.extractUserIdFromSocket(client);
      if (userId) {
        client.userId = userId;
        this.userConnections.set(userId, client.id);

        // Join user to their personal room
        await client.join(`user_${userId}`);

        // Notify others that user is online
        client.broadcast.emit('userOnline', { userId });

        // Send unread messages to user
        const unreadMessages = await this.chatService.getUnreadMessages(userId);
        if (unreadMessages.length > 0) {
          client.emit('unreadMessages', unreadMessages);
        }

        this.logger.log(`User ${userId} connected with socket ${client.id}`);
      }
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.userConnections.delete(client.userId);

      // Notify others that user is offline
      client.broadcast.emit('userOffline', { userId: client.userId });

      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: ChatDTO,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      // Validate sender
      if (client.userId !== data.senderId) {
        client.emit('error', { message: 'Invalid sender ID' });
        return;
      }

      // Save message to database
      const savedMessage = await this.chatService.saveMessage(data);

      // Send to receiver if online
      const receiverSocketId = this.userConnections.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(`user_${data.receiverId}`).emit('receiveMessage', savedMessage);
      }

      // Send confirmation to sender
      client.emit('messageSent', savedMessage);

      this.logger.log(`Message sent from ${data.senderId} to ${data.receiverId}`);
    } catch (error) {
      this.logger.error('Send message error:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @MessageBody() data: { otherUserId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId) return;

      const conversationRoom = this.getConversationId(client.userId, data.otherUserId);
      await client.join(conversationRoom);

      // Mark messages as read
      await this.chatService.markMessagesAsRead(data.otherUserId, client.userId);

      // Load conversation history
      const messages = await this.chatService.getMessage(client.userId, data.otherUserId);
      client.emit('conversationHistory', messages.reverse());

      // Notify sender that messages have been read
      const senderSocketId = this.userConnections.get(data.otherUserId);
      if (senderSocketId) {
        this.server.to(`user_${data.otherUserId}`).emit('messagesRead', { userId: client.userId });
      }

      this.logger.log(`User ${client.userId} joined conversation with ${data.otherUserId}`);
    } catch (error) {
      this.logger.error('Join conversation error:', error);
      client.emit('error', { message: 'Failed to join conversation' });
    }
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @MessageBody() data: { otherUserId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId) return;

      const conversationRoom = this.getConversationId(client.userId, data.otherUserId);
      await client.leave(conversationRoom);

      this.logger.log(`User ${client.userId} left conversation with ${data.otherUserId}`);
    } catch (error) {
      this.logger.error('Leave conversation error:', error);
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { senderId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId) return;

      await this.chatService.markMessagesAsRead(data.senderId, client.userId);

      // Notify sender that messages have been read
      const senderSocketId = this.userConnections.get(data.senderId);
      if (senderSocketId) {
        this.server.to(`user_${data.senderId}`).emit('messagesRead', { userId: client.userId });
      }

      this.logger.log(`Messages marked as read by ${client.userId} from ${data.senderId}`);
    } catch (error) {
      this.logger.error('Mark as read error:', error);
      client.emit('error', { message: 'Failed to mark messages as read' });
    }
  }

  @SubscribeMessage('getOnlineUsers')
  async handleGetOnlineUsers(@ConnectedSocket() client: AuthenticatedSocket) {
    const onlineUserIds = Array.from(this.userConnections.keys());
    client.emit('onlineUsers', onlineUserIds);
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { receiverId: string, isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) return;

    const receiverSocketId = this.userConnections.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(`user_${data.receiverId}`).emit('userTyping', {
        userId: client.userId,
        isTyping: data.isTyping
      });
    }
  }

  private extractUserIdFromSocket(client: Socket): string | null {
    // Try to get userId from query params
    const userId = client.handshake.query.userId as string;

    if (userId) {
      return userId;
    }

    // Try to get from auth header or token
    const token = client.handshake.auth?.token || client.handshake.headers.authorization;
    if (token) {
      try {
        // Decode JWT token (you may need to implement proper JWT verification)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload.sub || payload.userId || payload.id;
      } catch (error) {
        this.logger.error('Error decoding token:', error);
      }
    }

    return null;
  }

  private getConversationId(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort();
    return `conversation_${sortedIds[0]}_${sortedIds[1]}`;
  }
}