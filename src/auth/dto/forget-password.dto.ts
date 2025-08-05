import { IsEmail, IsString, MinLength } from "class-validator";

export class ChangePasswordDTO {
   @IsString({message: 'Email không được để trống'})
   @IsEmail({}, {message: 'Email không hợp lệ'})
  email: string;

}