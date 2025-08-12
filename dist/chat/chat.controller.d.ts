import { HttpStatus } from '@nestjs/common';
import { ChatService } from 'src/chat/chat-service';
import { ChatDTO } from 'src/chat/dtos/chat.dtos';
import { Chat } from 'src/chat/schema/chat.schema';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getMessages(userId1: string, userId2: string, page?: string, pageSize?: string): Promise<{
        success: boolean;
        data: Chat[];
        status: HttpStatus;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        status: HttpStatus;
        data?: undefined;
    }>;
    getUnreadMessages(userId: string): Promise<{
        success: boolean;
        data: Chat[];
        count: number;
        status: HttpStatus;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        status: HttpStatus;
        data?: undefined;
        count?: undefined;
    }>;
    markAsRead(body: {
        senderId: string;
        receiverId: string;
    }): Promise<{
        success: boolean;
        message: any;
        status: HttpStatus;
    }>;
    sendMessage(chatDto: ChatDTO): Promise<{
        success: boolean;
        data: Chat;
        status: HttpStatus;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        status: HttpStatus;
        data?: undefined;
    }>;
    getMessage(messageId: string): Promise<{
        success: boolean;
        data: Chat;
        status: HttpStatus;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        status: HttpStatus;
        data?: undefined;
    }>;
    getConversations(userId: string): Promise<{
        success: boolean;
        data: any[];
        status: HttpStatus;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        status: HttpStatus;
        data?: undefined;
    }>;
    deleteMessage(messageId: string, body: {
        userId: string;
    }): Promise<{
        success: boolean;
        message: any;
        status: HttpStatus;
    }>;
}
