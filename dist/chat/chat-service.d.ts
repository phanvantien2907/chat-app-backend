import { NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { ChatDTO } from "src/chat/dtos/chat.dtos";
import { Message } from "src/chat/schema/messages.schema";
export declare class ChatService {
    private messageModel;
    constructor(messageModel: Model<Message>);
    saveMessage(ChatDTO: ChatDTO): Promise<import("mongoose").Document<unknown, {}, Message, {}, {}> & Message & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMessage(roomId: string): Promise<NotFoundException | (import("mongoose").Document<unknown, {}, Message, {}, {}> & Message & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
