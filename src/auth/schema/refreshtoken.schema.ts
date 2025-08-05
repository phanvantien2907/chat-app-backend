import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";


@Schema({ versionKey: false, timestamps: true })
export class RefreshToken extends Document {
    declare _id: Types.ObjectId;
    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true })
    exp_date: Date;
}
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
