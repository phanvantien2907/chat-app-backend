import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Chat extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
