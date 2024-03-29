"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRouter = exports.settingsRouter = exports.userRouter = exports.authRouter = void 0;
const auth_router_1 = __importDefault(require("./auth.router"));
exports.authRouter = auth_router_1.default;
const user_router_1 = __importDefault(require("./user.router"));
exports.userRouter = user_router_1.default;
const settings_router_1 = __importDefault(require("./settings.router"));
exports.settingsRouter = settings_router_1.default;
const wallet_router_1 = __importDefault(require("./wallet.router"));
exports.walletRouter = wallet_router_1.default;
//# sourceMappingURL=index.js.map