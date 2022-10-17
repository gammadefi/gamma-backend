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
const exceptions_1 = require("../exceptions");
const services_1 = require("../services");
const mongoose_1 = require("mongoose");
class UserController {
    constructor() {
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, skip } = req.query;
                const limitValue = limit ? Number(limit) : 20;
                const offsetValue = skip ? Number(skip) : 0;
                const users = yield this.service.getAllUsers(offsetValue, limitValue);
                return res.status(200).json({ status: "success", data: users });
            }
            catch (err) {
                next(err);
            }
        });
        this.getAllPending = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, skip } = req.query;
                const limitValue = limit ? Number(limit) : 20;
                const offsetValue = skip ? Number(skip) : 0;
                const users = yield this.service.getAllPendingUsers(offsetValue, limitValue);
                return res.status(200).json({ status: "success", data: users });
            }
            catch (err) {
                next(err);
            }
        });
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                if (!email)
                    throw new exceptions_1.BadRequestError(`No email address provided`);
                const user = yield this.service.getOneUser({ email });
                return res.status(200).json({ status: "success", data: user });
            }
            catch (err) {
                next(err);
            }
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    throw new exceptions_1.BadRequestError(`No id provided`);
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    throw new exceptions_1.BadRequestError(`Invalid id`);
                const user = yield this.service.getUserById(id);
                return res.status(200).json({ status: "success", data: user });
            }
            catch (err) {
                next(err);
            }
        });
        this.getAPendingUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                if (!email)
                    throw new exceptions_1.BadRequestError(`No email address provided`);
                const user = yield this.service.getPendingUser(email);
                return res.status(200).json({ status: "success", data: user });
            }
            catch (err) {
                next(err);
            }
        });
        this.service = new services_1.UserService();
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map