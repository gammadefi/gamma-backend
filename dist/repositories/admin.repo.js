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
class AdminRepo {
    getAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield models_1.AdminModel.find().skip(skip).limit(limit);
            return admins;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield models_1.AdminModel.findById(id);
            return admin;
        });
    }
    where(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield models_1.AdminModel.find({ fields });
            return admins;
        });
    }
    whereOne(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield models_1.AdminModel.findOne(fields);
            return admin;
        });
    }
    update(id, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield models_1.AdminModel.findByIdAndUpdate(id, fields, {
                returnDocument: "after",
            });
            return admin;
        });
    }
    updateMany(filter, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.AdminModel.updateMany(filter, updateFields);
            const users = yield this.where(filter);
            return users;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.AdminModel.findByIdAndDelete(id);
        });
    }
    deleteMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.AdminModel.deleteMany(filter);
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.AdminModel.create(data);
        });
    }
}
exports.default = AdminRepo;
//# sourceMappingURL=admin.repo.js.map