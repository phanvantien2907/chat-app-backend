import { IsString } from "class-validator";

export class RefreshTokenDTO {
    @IsString({ message: 'Token không được để trống' })
    token: string;
}