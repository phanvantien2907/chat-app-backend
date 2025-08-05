import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ChatService } from "src/chat/chat-service";

@WebSocketGateway(3001, {})
export class ChatGateway {
    constructor(private chatService: ChatService) {}

   @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() msg: string) {
    const save_msg = await this.chatService.getMessage(msg);
    client.broadcast.emit('message', save_msg);
    client.emit('message', save_msg);
    }

   }
