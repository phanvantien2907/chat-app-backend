import { Document, Types } from "mongoose";
export declare class Auth extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    fullname: string;
    password: string;
    is_active: boolean;
    is_deleted: boolean;
}
export declare const AuthSchema: import("mongoose").Schema<Auth, import("mongoose").Model<Auth, any, any, any, Document<unknown, any, Auth, any, {}> & Auth & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Auth, Document<unknown, {}, import("mongoose").FlatRecord<Auth>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Auth> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
