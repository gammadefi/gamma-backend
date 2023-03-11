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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    phone: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["M", "F"],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        unique: true,
        sparse: true,
    },
    assets: [
        {
            type: String,
        },
    ],
    wallet: [
        {
            type: mongoose_1.Schema.Types.Mixed,
        },
    ],
    verificationCode: String,
    refreshTokens: [String],
    devices: [mongoose_1.Schema.Types.Mixed],
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    pendingPhone: String,
    pendingEmail: String,
    verificationExpiry: Date,
    lastSensitiveInfoUpdateTime: Date,
}, { timestamps: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const hash = yield bcrypt_1.default.hash(this.password, 10);
            this.password = hash;
        }
        next();
    });
});
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const correct = yield bcrypt_1.default.compare(password, this.password);
        return correct;
    });
};
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map