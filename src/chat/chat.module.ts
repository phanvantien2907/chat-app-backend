import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from 'src/chat/chat-gateway';
import { ChatService } from 'src/chat/chat-service';
import { ChatController } from 'src/chat/chat.controller';
import { Chat, ChatSchema } from 'src/chat/schema/chat.schema';

@Module({
    imports: [MongooseModule.forFeature([{name:Chat.name, schema:ChatSchema, collection: 'chat'}])],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
    exports: [ChatGateway, ChatService],
})
export class ChatModule {}
