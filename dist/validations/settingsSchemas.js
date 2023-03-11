"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = exports.createSettingsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSettingsSchema = joi_1.default.object({
    verificationCodeExpiry: joi_1.default.number().required(),
});
exports.updateSettingsSchema = joi_1.default.object({
    verificationCodeExpiry: joi_1.default.number(),
});
//# sourceMappingURL=settingsSchemas.js.map