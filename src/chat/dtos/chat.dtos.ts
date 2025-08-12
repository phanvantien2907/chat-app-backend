import { IsString } from "class-validator";

export class ChatDTO {
    @IsString()
    senderId: string;
     @IsString()
    receiverId: string;
     @IsString()
    content: string;
}