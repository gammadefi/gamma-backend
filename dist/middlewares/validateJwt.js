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
const exceptions_1 = require("../exceptions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const repositories_1 = require("../repositories");
const moment_1 = __importDefault(require("moment"));
const userRepo = new repositories_1.UserRepo();
const adminRepo = new repositories_1.AdminRepo();
function default_1() {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { authorization } = req.headers;
            if (!authorization)
                throw new exceptions_1.UnauthorizedError(`No authorization headers passed`);
            const bearer = authorization.split(" ")[0];
            const token = authorization.split(" ")[1];
            if (!bearer || !token)
                throw new exceptions_1.UnauthorizedError(`Token not passed in authorization headers`);
            if (bearer !== "Bearer")
                throw new exceptions_1.UnauthorizedError(`Bearer not passed in authorization headers`);
            const decoded = jsonwebtoken_1.default.verify(token, String(config_1.ACCESS_TOKEN_SECRET));
            let resource;
            if (decoded.resourceType === "user") {
                resource = yield userRepo.getById(decoded.id);
                req.user = resource;
            }
            else if (decoded.resourceType === "admin") {
                resource = yield adminRepo.getById(decoded.id);
                req.admin = resource;
            }
            if (!resource)
                throw new exceptions_1.UnauthorizedError(`Resource recently deleted!`);
            if (resource.lastSensitiveInfoUpdateTime &&
                (0, moment_1.default)(decoded.iat).isBefore(resource.lastSensitiveInfoUpdateTime))
                throw new exceptions_1.UnauthorizedError(`Sensitive information changed recently, please log in again!`);
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=validateJwt.js.map