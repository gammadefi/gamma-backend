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
const services_1 = require("../services");
class AuthController {
    constructor() {
        this.initReg = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const verificationCode = yield this.service.initializeSignUp(email);
                return res
                    .status(200)
                    .json({ status: "success", data: verificationCode });
            }
            catch (err) {
                next(err);
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password, verificationCode } = req.body;
                const user = yield this.service.signUp(email, name, password, verificationCode, req.device);
                return res.status(201).json({ status: "success", data: user });
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const device = req.device;
                const { refreshToken, accessToken, user } = yield this.service.login(email, password, device);
                return res
                    .cookie("jwt", refreshToken, {
                    httpOnly: true,
                })
                    .status(200)
                    .json({
                    status: "success",
                    data: { refreshToken, accessToken, user },
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.verifyDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, verificationCode } = req.body;
                const { user, refreshToken, accessToken } = yield this.service.verifyDevice(email, req.device, verificationCode);
                return res
                    .cookie("jwt", refreshToken, {
                    httpOnly: true,
                })
                    .status(200)
                    .json({
                    status: "success",
                    data: { refreshToken, accessToken, user },
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.service = new services_1.AuthService();
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map