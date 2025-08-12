"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("./schema/chat.schema");
let ChatService = class ChatService {
    messageModel;
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    async saveMessage(ChatDTO) {
        const msg = new this.messageModel(ChatDTO);
        return msg.save();
    }
    async getMessage(senderId, receiverId, page = 1, pageSize = 50) {
        const skip = (page - 1) * pageSize;
        return await this.messageModel
            .find({
            $or: [
                {
                    senderId: new mongoose_2.Types.ObjectId(senderId),
                    receiverId: new mongoose_2.Types.ObjectId(receiverId)
                },
                {
                    senderId: new mongoose_2.Types.ObjectId(receiverId),
                    receiverId: new mongoose_2.Types.ObjectId(senderId)
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
    async getUnreadMessages(receiverId) {
        return await this.messageModel
            .find({
            receiverId: new mongoose_2.Types.ObjectId(receiverId),
            isRead: false,
            is_deleted: false
        })
            .populate('senderId', 'username fullname')
            .exec();
    }
    async markMessagesAsRead(senderId, receiverId) {
        await this.messageModel.updateMany({
            senderId: new mongoose_2.Types.ObjectId(senderId),
            receiverId: new mongoose_2.Types.ObjectId(receiverId),
            isRead: false
        }, { isRead: true });
    }
    async getMessageById(messageId) {
        return await this.messageModel
            .findById(messageId)
            .populate('senderId', 'username fullname')
            .populate('receiverId', 'username fullname')
            .exec();
    }
    async deleteMessage(messageId, userId) {
        const result = await this.messageModel.updateOne({
            _id: new mongoose_2.Types.ObjectId(messageId),
            senderId: new mongoose_2.Types.ObjectId(userId)
        }, { is_deleted: true });
        return result.modifiedCount > 0;
    }
    async getConversations(userId) {
        const conversations = await this.messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: new mongoose_2.Types.ObjectId(userId) },
                        { receiverId: new mongoose_2.Types.ObjectId(userId) }
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
                            { $eq: ['$senderId', new mongoose_2.Types.ObjectId(userId)] },
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
                                        { $eq: ['$receiverId', new mongoose_2.Types.ObjectId(userId)] },
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
    async markAsRead(chat_id) {
        return this.messageModel.findByIdAndUpdate(chat_id, { isRead: true }, { new: true });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat-service.js.map