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
const repositories_1 = require("../repositories");
const exceptions_1 = require("../exceptions");
const auth_service_1 = __importDefault(require("./auth.service"));
class UserService {
    constructor() {
        this.repo = new repositories_1.UserRepo();
        this.pendingRepo = new repositories_1.PendingUserRepo();
        this.auth = new auth_service_1.default();
    }
    getAllPendingUsers(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pendingRepo.getAll(skip, limit);
        });
    }
    getPendingUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingUser = yield this.pendingRepo.getOne(email);
            if (!pendingUser)
                throw new exceptions_1.NotFoundError(`No pending user found with email ${email}`);
            return pendingUser;
        });
    }
    getAllUsers(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.getAll(skip, limit);
        });
    }
    getUsers(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.repo.where(filter);
            if (users.length < 1)
                throw new exceptions_1.NotFoundError(`No users found with ${Object.keys(filter)}`);
            return users;
        });
    }
    getOneUser(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.whereOne(filter);
            if (!user)
                throw new exceptions_1.NotFoundError(`No user found with ${Object.keys(filter)}`);
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.getById(id);
            if (!user)
                throw new exceptions_1.NotFoundError(`No user found with id ${id}`);
            return user;
        });
    }
    updateUser(id, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.update(id, fields);
            if (!user)
                throw new exceptions_1.NotFoundError(`No user found with id ${id}`);
            return user;
        });
    }
    updateUsers(filter, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.repo.updateMany(filter, fields);
            if (users.length < 1)
                throw new exceptions_1.NotFoundError(`No user found with ${filter}`);
            return users;
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map