import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ChatDTO } from "src/chat/dtos/chat.dtos";
import { Chat } from "src/chat/schema/chat.schema";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private messageModel: Model<Chat>) {}

    async saveMessage(ChatDTO: ChatDTO): Promise<Chat> {
     const msg = new this.messageModel(ChatDTO);
     return msg.save();
    }


    async getMessage(senderId: string, receiverId: string,page: number = 1, pageSize: number = 50): Promise<Chat[]> {
    const skip = (page - 1) * pageSize;
    return await this.messageModel
      .find({
        $or: [
          {
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(receiverId)
          },
          {
            senderId: new Types.ObjectId(receiverId),
            receiverId: new Types.ObjectId(senderId)
          }
        ],
        is_deleted: false
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('senderId', 'username fullname')
      .populate('receiverId', 'username fullname')
      .exec();
    }

    async getUnreadMessages(receiverId: string): Promise<Chat[]> {
    return await this.messageModel
      .find({
        receiverId: new Types.ObjectId(receiverId),
        isRead: false,
        is_deleted: false
      })
      .populate('senderId', 'username fullname')
      .exec();
  }

    async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await this.messageModel.updateMany(
      {
        senderId: new Types.ObjectId(senderId),
        receiverId: new Types.ObjectId(receiverId),
        isRead: false
      },
      { isRead: true }
    );
  }

  async getMessageById(messageId: string): Promise<Chat | null> {
    return await this.messageModel
      .findById(messageId)
      .populate('senderId', 'username fullname')
      .populate('receiverId', 'username fullname')
      .exec();
  }

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const result = await this.messageModel.updateOne(
      {
        _id: new Types.ObjectId(messageId),
        senderId: new Types.ObjectId(userId)
      },
      { is_deleted: true }
    );

    return result.modifiedCount > 0;
  }


  async getConversations(userId: string): Promise<any[]> {
    const conversations = await this.messageModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: new Types.ObjectId(userId) },
            { receiverId: new Types.ObjectId(userId) }
          ],
          is_deleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new Types.ObjectId(userId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    return conversations;
  }

    async markAsRead(chat_id: string) {
        return this.messageModel.findByIdAndUpdate(chat_id, { isRead: true }, { new: true });
    }
}