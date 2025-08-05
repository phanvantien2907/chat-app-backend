import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDTO {
    @IsString({message: 'Tên đăng nhập không được để trống'})
    @MinLength(3, {message: 'Tên đăng nhập phải có ít nhất 3 ký tự'})
    username: string;

    @IsString({message: 'Email không được để trống'})
    @IsEmail({}, {message: 'Email không hợp lệ'})
    email: string;

    @IsString({message: 'Họ và tên không được để trống'})
    @MinLength(3, {message: 'Họ và tên phải có ít nhất 3 ký tự'})
    fullname: string;

    @IsString({message: 'Mật khẩu không được để trống'})
    @MinLength(6, {message: 'Mật khẩu phải có ít nhất 6 ký tự'})
    password: string;
}