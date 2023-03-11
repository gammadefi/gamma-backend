"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepo = exports.SettingsRepo = exports.TokenRepo = exports.UserRepo = exports.PendingUserRepo = void 0;
const pendingUser_repo_1 = __importDefault(require("./pendingUser.repo"));
exports.PendingUserRepo = pendingUser_repo_1.default;
const user_repo_1 = __importDefault(require("./user.repo"));
exports.UserRepo = user_repo_1.default;
const token_repo_1 = __importDefault(require("./token.repo"));
exports.TokenRepo = token_repo_1.default;
const settings_repo_1 = __importDefault(require("./settings.repo"));
exports.SettingsRepo = settings_repo_1.default;
const admin_repo_1 = __importDefault(require("./admin.repo"));
exports.AdminRepo = admin_repo_1.default;
//# sourceMappingURL=index.js.map