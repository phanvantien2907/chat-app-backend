import mongoose, { Document, Types } from "mongoose";
export declare class RefreshToken extends Document {
    _id: Types.ObjectId;
    token: string;
    userId: Types.ObjectId;
    exp_date: Date;
}
export declare const RefreshTokenSchema: mongoose.Schema<RefreshToken, mongoose.Model<RefreshToken, any, any, any, mongoose.Document<unknown, any, RefreshToken, any, {}> & RefreshToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RefreshToken, mongoose.Document<unknown, {}, mongoose.FlatRecord<RefreshToken>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<RefreshToken> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
