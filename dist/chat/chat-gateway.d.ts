import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat-service';
import { ChatDTO } from 'src/chat/dtos/chat.dtos';
interface AuthenticatedSocket extends Socket {
    userId?: string;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    private readonly logger;
    private userConnections;
    constructor(chatService: ChatService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): Promise<void>;
    handleSendMessage(data: ChatDTO, client: AuthenticatedSocket): Promise<void>;
    handleJoinConversation(data: {
        otherUserId: string;
    }, client: AuthenticatedSocket): Promise<void>;
    handleLeaveConversation(data: {
        otherUserId: string;
    }, client: AuthenticatedSocket): Promise<void>;
    handleMarkAsRead(data: {
        senderId: string;
    }, client: AuthenticatedSocket): Promise<void>;
    handleGetOnlineUsers(client: AuthenticatedSocket): Promise<void>;
    handleTyping(data: {
        receiverId: string;
        isTyping: boolean;
    }, client: AuthenticatedSocket): Promise<void>;
    private extractUserIdFromSocket;
    private getConversationId;
}
export {};
