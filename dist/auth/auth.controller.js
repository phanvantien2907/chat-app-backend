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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const register_dto_1 = require("./dto/register.dto");
const resert_password_dto_1 = require("./dto/resert-password.dto");
const guards_guard_1 = require("../guards/guards.guard");
const http_exception_filter_1 = require("../exception/http-exception.filter");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(registerData) {
        return this.authService.register(registerData);
    }
    login(loginData, response) {
        return this.authService.login(loginData, response);
    }
    refreshtoken(rftokenDTO) {
        return this.authService.refreshtoken(rftokenDTO.token);
    }
    logout(req) {
        const user = req['user'];
        return this.authService.logout(user.userId);
    }
    resetPassword(token, resetPasswordDTO) {
        return this.authService.resetPassword(resetPasswordDTO.newPassword, token);
    }
    changePassword(id, changeData, req) {
        const user = req['user'];
        return this.authService.changePassword(user.userId, changeData.oldPassword, changeData.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseFilters)(http_exception_filter_1.CatchEverythingFilter),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseFilters)(http_exception_filter_1.CatchEverythingFilter),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginrDTO, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseFilters)(http_exception_filter_1.CatchEverythingFilter),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshtoken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseFilters)(http_exception_filter_1.CatchEverythingFilter),
    (0, common_1.UseGuards)(guards_guard_1.GuardsGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('reset-password/:token'),
    (0, common_1.UseFilters)(http_exception_filter_1.CatchEverythingFilter),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resert_password_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(guards_guard_1.GuardsGuard),
    (0, common_1.UseFilters)(http_exception_filter_1.CatchEverythingFilter),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Request]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map