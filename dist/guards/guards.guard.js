"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardsGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let GuardsGuard = class GuardsGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const openRouter = ['/auth/login', '/auth/register', '/auth/forget-password', '/auth/reset-password/:id'];
        if (openRouter.includes(req.url)) {
            return true;
        }
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            throw new Error('Thiếu token');
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req['user'] = decoded;
            return true;
        }
        catch (err) {
            throw new Error('Token không hợp lệ hoặc đã hết hạn');
        }
    }
};
exports.GuardsGuard = GuardsGuard;
exports.GuardsGuard = GuardsGuard = __decorate([
    (0, common_1.Injectable)()
], GuardsGuard);
//# sourceMappingURL=guards.guard.js.map