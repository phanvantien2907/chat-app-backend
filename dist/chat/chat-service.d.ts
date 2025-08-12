import { Model } from "mongoose";
import { ChatDTO } from "src/chat/dtos/chat.dtos";
import { Chat } from "src/chat/schema/chat.schema";
export declare class ChatService {
    private messageModel;
    constructor(messageModel: Model<Chat>);
    saveMessage(ChatDTO: ChatDTO): Promise<Chat>;
    getMessage(senderId: string, receiverId: string, page?: number, pageSize?: number): Promise<Chat[]>;
    getUnreadMessages(receiverId: string): Promise<Chat[]>;
    markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
    getMessageById(messageId: string): Promise<Chat | null>;
    deleteMessage(messageId: string, userId: string): Promise<boolean>;
    getConversations(userId: string): Promise<any[]>;
    markAsRead(chat_id: string): Promise<(import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
