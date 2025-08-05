import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class ResetToken {
   @Prop({ required: true })
    token: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    userId: string;

    @Prop({ required: true })
    exp_date: Date;
}
export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);