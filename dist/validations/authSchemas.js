"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhoneOrMailSchema = exports.updateEmailorPhoneSchema = exports.verifyDeviceSchema = exports.loginSchema = exports.registerSchema = exports.registerAdminSchema = exports.initRegSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.initRegSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
});
exports.registerAdminSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required().min(8)
});
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    dob: joi_1.default.date().required(),
    title: joi_1.default.string().required(),
    gender: joi_1.default.string().valid("M", "F").required(),
    password: joi_1.default.string().required().min(8),
    verificationCode: joi_1.default.string().disallow("").required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.verifyDeviceSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    verificationCode: joi_1.default.string().disallow("").required(),
});
exports.updateEmailorPhoneSchema = joi_1.default.object({
    value: joi_1.default.string().required()
});
exports.verifyPhoneOrMailSchema = joi_1.default.object({
    value: joi_1.default.string().required(),
    verificationCode: joi_1.default.string().disallow("").required(),
});
//# sourceMappingURL=authSchemas.js.map