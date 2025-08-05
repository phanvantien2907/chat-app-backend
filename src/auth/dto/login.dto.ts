import { IsString, MinLength } from 'class-validator';
export class LoginrDTO {
    @IsString({message: 'Tên đăng nhập không được để trống'})
     @MinLength(3, {message: 'Tên đăng nhập phải có ít nhất 3 ký tự'})
     username: string;

     @IsString({message: 'Mật khẩu không được để trống'})
    @MinLength(6, {message: 'Mật khẩu phải có ít nhất 6 ký tự'})
    password: string;
}