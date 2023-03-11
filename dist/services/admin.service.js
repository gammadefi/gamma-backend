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
const repositories_1 = require("../repositories");
const exceptions_1 = require("../exceptions");
class AdminService {
    constructor() {
        this.repo = new repositories_1.AdminRepo();
    }
    getAllAdmins(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.getAll(skip, limit);
        });
    }
    getAdmin(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield this.repo.where(filter);
            if (admins.length < 1)
                throw new exceptions_1.NotFoundError(`No admins found with ${Object.keys(filter)}`);
            return admins;
        });
    }
    getOneAdmin(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.repo.whereOne(filter);
            if (!admin)
                throw new exceptions_1.NotFoundError(`No admin found with ${Object.keys(filter)}`);
            return admin;
        });
    }
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.repo.getById(id);
            if (!admin)
                throw new exceptions_1.NotFoundError(`No admin found with id ${id}`);
            return admin;
        });
    }
    updateAdmin(id, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.repo.update(id, fields);
            if (!admin)
                throw new exceptions_1.NotFoundError(`No admin found with id ${id}`);
            return admin;
        });
    }
    updateAdmins(filter, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield this.repo.updateMany(filter, fields);
            if (admins.length < 1)
                throw new exceptions_1.NotFoundError(`No admin found with ${filter}`);
            return admins;
        });
    }
}
exports.default = AdminService;
//# sourceMappingURL=admin.service.js.map