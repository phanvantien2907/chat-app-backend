import { IsString, MinLength } from "class-validator";

export class ChangePasswordDTO {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6, {message: 'Mật khẩu phải có ít nhất 6 ký tự'})
  newPassword: string;
}