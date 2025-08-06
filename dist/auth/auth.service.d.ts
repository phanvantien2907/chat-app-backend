import { HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { Auth } from 'src/auth/schema/auth.schema';
import { LoginrDTO } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'src/auth/schema/refreshtoken.schema';
import { ResetToken } from 'src/auth/schema/resert-token.schema';
import { Response } from 'express';
export declare class AuthService {
    private authModel;
    private refreshModel;
    private resetModel;
    private jwtService;
    constructor(authModel: Model<Auth>, refreshModel: Model<RefreshToken>, resetModel: Model<ResetToken>, jwtService: JwtService);
    register(registerData: RegisterDTO): Promise<{
        msg: string;
        status: HttpStatus;
    }>;
    login(loginData: LoginrDTO, response: Response): Promise<Response<any, Record<string, any>>>;
    refreshtoken(rftoken: string): Promise<{
        access_token: string;
        status: HttpStatus;
    }>;
    logout(userId: string): Promise<{
        msg: string;
        status: HttpStatus;
    }>;
    resetPassword(newPassword: string, resetToken: string): Promise<{
        msg: string;
        status: HttpStatus;
    }>;
    changePassword(userId: any, oldPassword: string, newPassword: string): Promise<{
        msg: string;
        status: HttpStatus;
    }>;
    generatortoken(userId: string): Promise<{
        access_token: string;
        refresh_token: string;
        status: HttpStatus;
    }>;
    hashPassword(password: string): Promise<string>;
}
