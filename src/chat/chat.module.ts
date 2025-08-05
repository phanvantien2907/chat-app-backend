import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from 'src/chat/chat-gateway';
import { ChatService } from 'src/chat/chat-service';
import { Message, MessageSchema } from 'src/chat/schema/messages.schema';

@Module({
    imports: [MongooseModule.forFeature([{name:Message.name, schema:MessageSchema, collection: 'messages'}])],
    controllers: [],
    providers: [ChatGateway, ChatService],
    exports: [ChatGateway],
})
export class ChatModule {}
