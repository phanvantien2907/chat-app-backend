import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginrDTO } from 'src/auth/dto/login.dto';
import { RefreshTokenDTO } from 'src/auth/dto/refresh-token.dto';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { ResetPasswordDTO } from 'src/auth/dto/resert-password.dto';
import { GuardsGuard } from 'src/guards/guards.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerData: RegisterDTO) {
  return this.authService.register(registerData);
  }
  @Post('login')
  login(@Body() loginData: LoginrDTO) {
    return this.authService.login(loginData);
  }

  @Post('refresh')
  refreshtoken(@Body() rftokenDTO: RefreshTokenDTO) {
   return this.authService.refreshtoken(rftokenDTO.token);
  }

  @Post('logout')
  @UseGuards(GuardsGuard)
  logout(@Req() req: Request) {
  const user = req['user'];
  return this.authService.logout(user.userId);
  }

  // @Post('forget-password')
  // forgetPassword(@Body() body: { email: string }) {
  //   return this.authService.forgetPassword(body.email);
  // }
  @Post('reset-password/:token')
 resetPassword(@Param('token') token: string, @Body() resetPasswordDTO: ResetPasswordDTO) {
  return this.authService.resetPassword(resetPasswordDTO.newPassword, token);
  }
  @Post('change-password')
  @UseGuards(GuardsGuard)
 changePassword(@Param('id') id: string, @Body() changeData: { oldPassword: string, newPassword: string }, @Req() req: Request) {
    const user = req['user'];
   return this.authService.changePassword(user.userId, changeData.oldPassword, changeData.newPassword);
  }
}
