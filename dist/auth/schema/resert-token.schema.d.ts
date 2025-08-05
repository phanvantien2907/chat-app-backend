import mongoose from "mongoose";
export declare class ResetToken {
    token: string;
    userId: string;
    exp_date: Date;
}
export declare const ResetTokenSchema: mongoose.Schema<ResetToken, mongoose.Model<ResetToken, any, any, any, mongoose.Document<unknown, any, ResetToken, any, {}> & ResetToken & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ResetToken, mongoose.Document<unknown, {}, mongoose.FlatRecord<ResetToken>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<ResetToken> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
