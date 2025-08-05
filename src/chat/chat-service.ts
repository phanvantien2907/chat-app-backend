import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatDTO } from "src/chat/dtos/chat.dtos";
import { Message } from "src/chat/schema/messages.schema";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

    async saveMessage(ChatDTO: ChatDTO) {
        const msg = new this.messageModel(ChatDTO);
        return msg.save();
    }

    async getMessage(roomId: string) {
        const find_room = await this.messageModel.find({ roomId: roomId }).sort({ createdAt: 1 }).limit(50).exec();
        if(find_room.length == 0) {
            return new NotFoundException('Phòng không tồn tại');
        }
        return find_room;
    }
}