"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVerificationCode = exports.signJWT = exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const connectToDB = (DB) => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default
        .connect(DB)
        .then(() => console.log("Connected to DB successfully!"))
        .catch((err) => console.log(`An error occured while connecting to DB: ${err}`));
});
exports.connectToDB = connectToDB;
const signJWT = (data, secret, expiry) => {
    const token = jsonwebtoken_1.default.sign(data, secret, {
        expiresIn: expiry
    });
    return token;
};
exports.signJWT = signJWT;
const createVerificationCode = (n) => {
    let code = '';
    for (let i = 0; i <= n; i++)
        code += crypto_1.default.randomInt(0, 9);
    return code;
};
exports.createVerificationCode = createVerificationCode;
//# sourceMappingURL=index.js.map