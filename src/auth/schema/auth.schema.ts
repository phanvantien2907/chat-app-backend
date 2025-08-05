import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ versionKey: false, timestamps: true })
export class Auth extends Document {
   declare _id: Types.ObjectId;
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    fullname: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: false })
    is_active:boolean;

    @Prop({ default: false })
    is_deleted: boolean;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
