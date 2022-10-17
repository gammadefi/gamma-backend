"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDeviceSchema = exports.loginSchema = exports.registerSchema = exports.initRegSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.initRegSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
});
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    verificationCode: joi_1.default.string().required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.verifyDeviceSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    verificationCode: joi_1.default.string().required(),
});
//# sourceMappingURL=authSchemas.js.map