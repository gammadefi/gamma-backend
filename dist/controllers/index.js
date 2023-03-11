"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = exports.cardController = exports.walletCOntroller = exports.UserController = exports.AuthController = void 0;
const auth_controller_1 = __importDefault(require("./auth.controller"));
exports.AuthController = auth_controller_1.default;
const user_controller_1 = __importDefault(require("./user.controller"));
exports.UserController = user_controller_1.default;
const wallet_controller_1 = __importDefault(require("./wallet.controller"));
exports.walletCOntroller = wallet_controller_1.default;
const card_controller_1 = __importDefault(require("./card.controller"));
exports.cardController = card_controller_1.default;
const settings_controller_1 = __importDefault(require("./settings.controller"));
exports.SettingsController = settings_controller_1.default;
//# sourceMappingURL=index.js.map