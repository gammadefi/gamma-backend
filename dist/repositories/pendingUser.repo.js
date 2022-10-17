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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class PendingUserRepo {
    getAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.PendingUserModel.find().skip(skip).limit(limit);
            return users;
        });
    }
    getOne(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.PendingUserModel.findOne({ email });
            return user;
        });
    }
    update(email, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.PendingUserModel.findOneAndUpdate({ email }, updateFields);
            const user = yield this.getOne(email);
            return user;
        });
    }
    delete(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.PendingUserModel.deleteOne({ email });
        });
    }
    create(email, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.PendingUserModel.create({ email, verificationCode });
        });
    }
}
exports.default = PendingUserRepo;
//# sourceMappingURL=pendingUser.repo.js.map