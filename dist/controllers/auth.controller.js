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
const exceptions_1 = require("../exceptions");
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
        this.registerAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.signupAdmin(req.body.email, req.body.password);
                return res.status(200).json({ status: "success", data });
            }
            catch (err) {
                next(err);
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, firstName, lastName, dob, title, gender, password, verificationCode, } = req.body;
                const user = yield this.service.signUp(email, firstName, lastName, dob, title, gender, password, verificationCode, req.device);
                return res.status(201).json({ status: "success", data: user });
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (resourceType) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { email, password } = req.body;
                    const device = req.device;
                    const data = yield this.service.login(email, password, device, resourceType);
                    return res
                        .cookie("jwt", data.refreshToken, {
                        httpOnly: true,
                    })
                        .status(200)
                        .json({
                        status: "success",
                        data,
                    });
                }
                catch (err) {
                    next(err);
                }
            });
        };
        this.verifyDevice = (resourceType) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { email, verificationCode } = req.body;
                    const data = yield this.service.verifyDevice(email, req.device, verificationCode, resourceType);
                    return res
                        .cookie("jwt", data.refreshToken, {
                        httpOnly: true,
                    })
                        .status(200)
                        .json({
                        status: "success",
                        data,
                    });
                }
                catch (err) {
                    next(err);
                }
            });
        };
        this.sendCode = (resourceType) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let value;
                    const resource = resourceType === "user" ? req.user : req.admin;
                    const channel = req.params.channel;
                    if (channel === "phone")
                        value = resource.phone;
                    else if (channel === "email")
                        value = resource.email;
                    else
                        throw new exceptions_1.BadRequestError(`Invalid channel type passed in request parameters!`);
                    yield this.service.sendCode(channel, value, resourceType);
                    return res.status(200).json({ status: "success" });
                }
                catch (err) {
                    next(err);
                }
            });
        };
        this.updatePhoneOrMail = (channel) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { value } = req.body;
                    yield this.service.updatePhoneOrEmail(channel, value, req.user._id);
                    return res.status(200).json({ status: "success" });
                }
                catch (err) {
                    next(err);
                }
            });
        };
        this.verifyPhoneOrMail = (channel) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { value, verificationCode } = req.body;
                    const updatedUser = yield this.service.verifyPhoneOrMail(channel, verificationCode, value);
                    return res.status(200).json({ status: "success", data: updatedUser });
                }
                catch (err) {
                    next(err);
                }
            });
        };
        this.service = new services_1.AuthService();
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map