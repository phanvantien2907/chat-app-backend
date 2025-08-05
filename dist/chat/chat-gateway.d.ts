import { Socket } from "socket.io";
import { ChatService } from "src/chat/chat-service";
export declare class ChatGateway {
    private chatService;
    constructor(chatService: ChatService);
    handleMessage(client: Socket, msg: string): Promise<void>;
}
