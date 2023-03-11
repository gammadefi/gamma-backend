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
class UserRepo {
    getAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.UserModel.find()
                .skip(skip)
                .limit(limit);
            return users;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.UserModel.findById(id);
            return user;
        });
    }
    where(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.UserModel.find({ fields });
            return users;
        });
    }
    whereOne(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.UserModel.findOne(fields);
            return user;
        });
    }
    update(id, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.UserModel.findByIdAndUpdate(id, fields, { returnDocument: 'after' });
            return user;
        });
    }
    updateMany(filter, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.UserModel.updateMany(filter, updateFields);
            const users = yield this.where(filter);
            return users;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.UserModel.findByIdAndDelete(id);
        });
    }
    deleteMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.UserModel.deleteMany(filter);
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserModel.create(data);
        });
    }
}
exports.default = UserRepo;
//# sourceMappingURL=user.repo.js.map