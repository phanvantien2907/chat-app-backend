import { Document, Types } from 'mongoose';
export declare class Chat extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    isRead: boolean;
    is_deleted: boolean;
}
export declare const ChatSchema: import("mongoose").Schema<Chat, import("mongoose").Model<Chat, any, any, any, Document<unknown, any, Chat, any, {}> & Chat & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, import("mongoose").FlatRecord<Chat>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Chat> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
