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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginrDTO = void 0;
const class_validator_1 = require("class-validator");
class LoginrDTO {
    username;
    password;
}
exports.LoginrDTO = LoginrDTO;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Tên đăng nhập không được để trống' }),
    (0, class_validator_1.MinLength)(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }),
    __metadata("design:type", String)
], LoginrDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Mật khẩu không được để trống' }),
    (0, class_validator_1.MinLength)(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
    __metadata("design:type", String)
], LoginrDTO.prototype, "password", void 0);
//# sourceMappingURL=login.dto.js.map