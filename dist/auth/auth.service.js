"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_decorators_1 = require("@nestjs/mongoose/dist/common/mongoose.decorators");
const mongoose_1 = require("mongoose");
const register_dto_1 = require("./dto/register.dto");
const auth_schema_1 = require("./schema/auth.schema");
const bcrypt = require("bcrypt");
const login_dto_1 = require("./dto/login.dto");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
const refreshtoken_schema_1 = require("./schema/refreshtoken.schema");
const resert_token_schema_1 = require("./schema/resert-token.schema");
let AuthService = class AuthService {
    authModel;
    refreshModel;
    resetModel;
    jwtService;
    constructor(authModel, refreshModel, resetModel, jwtService) {
        this.authModel = authModel;
        this.refreshModel = refreshModel;
        this.resetModel = resetModel;
        this.jwtService = jwtService;
    }
    async register(registerData) {
        const exiting_users = await this.authModel.findOne({ username: registerData.username });
        if (exiting_users) {
            throw new common_1.NotFoundException('Người dùng đã tồn tại');
        }
        const hashedPassword = await bcrypt.hash(registerData.password, 10);
        await this.authModel.create({ username: registerData.username, fullname: registerData.fullname, email: registerData.email, password: hashedPassword, is_active: true });
        return { msg: 'Đăng ký thành công', status: common_1.HttpStatus.CREATED };
    }
    async login(loginData, response) {
        const exiting_users = await this.authModel.findOne({ username: loginData.username });
        if (!exiting_users) {
            throw new common_1.NotFoundException('Người dùng không tồn tại!');
        }
        const valid_password = await bcrypt.compare(loginData.password, exiting_users.password);
        if (!valid_password) {
            throw new common_1.UnauthorizedException('Mật khẩu không đúng');
        }
        if (!exiting_users.is_active) {
            throw new common_1.BadRequestException('Tài khoản đã bị khóa');
        }
        const token = await this.generatortoken(exiting_users._id.toString());
        const new_last_login = new Date().toISOString();
        await this.authModel.findByIdAndUpdate(exiting_users._id, { last_login: new_last_login });
        response.cookie("token", token.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 60 * 60, path: '/' });
        return response.status(common_1.HttpStatus.OK).json({ msg: 'Đăng nhập thành công', user_id: exiting_users._id.toString(), username: exiting_users.username, fullName: exiting_users.fullname, last_login: new_last_login, refresh_token: token.refresh_token });
    }
    async refreshtoken(rftoken) {
        const token = await this.refreshModel.findOne({
            token: rftoken,
            exp_date: { $gt: new Date() }
        });
        if (!token) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
        const access_token = await this.jwtService.signAsync({ userId: token.userId }, { expiresIn: '1h', secret: process.env.JWT_SECRET });
        return { access_token, status: common_1.HttpStatus.OK };
    }
    async logout(userId) {
        const token = await this.refreshModel.findOne({ userId });
        if (!token) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        await this.refreshModel.deleteOne({ userId });
        return { msg: 'Đăng xuất thành công', status: common_1.HttpStatus.NO_CONTENT };
    }
    async resetPassword(newPassword, resetToken) {
        const token = await this.resetModel.findOne({ token: resetToken, exp_date: { $gt: new Date() } });
        if (!token) {
            throw new common_1.UnauthorizedException('Reset token không hợp lệ hoặc đã hết hạn');
        }
        const hashedPassword = await this.hashPassword(newPassword);
        await this.authModel.findByIdAndUpdate(token.userId, { password: hashedPassword });
        await this.resetModel.deleteOne({ token: resetToken });
        return { msg: 'Đặt lại mật khẩu thành công', status: common_1.HttpStatus.OK };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.authModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Mật khẩu cũ không đúng');
        }
        const hashedNewPassword = await this.hashPassword(newPassword);
        user.password = hashedNewPassword;
        await user.save();
        return { msg: 'Đổi mật khẩu thành công', status: common_1.HttpStatus.OK };
    }
    async generatortoken(userId) {
        const access_token = await this.jwtService.signAsync({ userId }, { expiresIn: '1h', secret: process.env.JWT_SECRET });
        const refresh_token = (0, uuid_1.v4)();
        await this.refreshModel.findOneAndUpdate({ userId }, { userId, token: refresh_token, exp_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, { upsert: true, new: true });
        return { access_token, refresh_token, status: common_1.HttpStatus.OK };
    }
    async hashPassword(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDTO]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "register", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginrDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "login", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_decorators_1.InjectModel)(auth_schema_1.Auth.name)),
    __param(1, (0, mongoose_decorators_1.InjectModel)(refreshtoken_schema_1.RefreshToken.name)),
    __param(2, (0, mongoose_decorators_1.InjectModel)(resert_token_schema_1.ResetToken.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map