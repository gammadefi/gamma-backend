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
const adminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshTokens: [String],
    verificationExpiry: Date,
    actions: [
        {
            type: mongoose_1.Schema.Types.Mixed,
        },
    ],
    active: Boolean,
    devices: [mongoose_1.Schema.Types.Mixed],
    verificationCode: String,
    pendingEmail: String,
    lastSensitiveInfoUpdateTime: Date
}, { timestamps: true });
adminSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const hash = yield bcrypt_1.default.hash(this.password, 10);
            this.password = hash;
        }
        next();
    });
});
adminSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const correct = yield bcrypt_1.default.compare(password, this.password);
        return correct;
    });
};
const AdminModel = (0, mongoose_1.model)("Admin", adminSchema);
exports.default = AdminModel;
//# sourceMappingURL=admin.model.js.map