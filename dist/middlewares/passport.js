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
exports.loginMiddleWare = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const services_1 = require("../services");
const localStrategy = passport_local_1.default.Strategy;
const userService = new services_1.UserService();
exports.loginMiddleWare = passport_1.default.use("login", new localStrategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.getOneUser({ email });
        if (!user) {
            return done(null, false, { message: "Invalid email or password" });
        }
        const validate = yield user.comparePassword(password);
        if (!validate) {
            return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user, { message: "Logged in Successfully" });
    }
    catch (error) {
        return done(error);
    }
})));
//# sourceMappingURL=passport.js.map