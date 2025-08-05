import { AuthService } from 'src/auth/auth.service';
import { LoginrDTO } from 'src/auth/dto/login.dto';
import { RefreshTokenDTO } from 'src/auth/dto/refresh-token.dto';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { ResetPasswordDTO } from 'src/auth/dto/resert-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerData: RegisterDTO): Promise<{
        msg: string;
        status: import("@nestjs/common").HttpStatus;
    }>;
    login(loginData: LoginrDTO): Promise<{
        status: import("@nestjs/common").HttpStatus;
        access_token: string;
        refresh_token: string;
        msg: string;
    }>;
    refreshtoken(rftokenDTO: RefreshTokenDTO): Promise<{
        access_token: string;
        status: import("@nestjs/common").HttpStatus;
    }>;
    logout(req: Request): Promise<{
        msg: string;
        status: import("@nestjs/common").HttpStatus;
    }>;
    resetPassword(token: string, resetPasswordDTO: ResetPasswordDTO): Promise<{
        msg: string;
        status: import("@nestjs/common").HttpStatus;
    }>;
    changePassword(id: string, changeData: {
        oldPassword: string;
        newPassword: string;
    }, req: Request): Promise<{
        msg: string;
        status: import("@nestjs/common").HttpStatus;
    }>;
}
