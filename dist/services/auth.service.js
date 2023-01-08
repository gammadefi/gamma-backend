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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const exceptions_1 = require("../exceptions");
const utils_1 = require("../utils");
const config_1 = require("../config");
const createWallet_1 = require("./api/createWallet");
class AuthService {
    constructor() {
        this.repo = new repositories_1.UserRepo();
        this.pendingRepo = new repositories_1.PendingUserRepo();
    }
    stripUser(user) {
        const _a = user._doc, { password, refreshTokens, devices } = _a, restOfUser = __rest(_a, ["password", "refreshTokens", "devices"]);
        return restOfUser;
    }
    signTokens(user) {
        const dataToSign = { id: user._id, resourceType: "user" };
        const accessToken = (0, utils_1.signJWT)(dataToSign, config_1.ACCESS_TOKEN_SECRET, config_1.ACCESS_TOKEN_EXPIRY);
        const refreshToken = (0, utils_1.signJWT)(dataToSign, config_1.REFRESH_TOKEN_SECRET, config_1.REFRESH_TOKEN_EXPIRY);
        return { refreshToken, accessToken };
    }
    login(email, password, device) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.whereOne({ email });
            if (!user || !user.comparePassword(password))
                throw new exceptions_1.UnauthorizedError(`No user found with email or password!`);
            const devices = user.devices;
            let deviceFound = false;
            devices.map((el) => {
                if (el.ip === device.ip &&
                    el.name === device.name &&
                    el.verified === true)
                    deviceFound = true;
            });
            if (!deviceFound) {
                const verificationCode = (0, utils_1.createVerificationCode)(5);
                yield this.repo.update(user._id, { verificationCode });
                throw new exceptions_1.UnauthorizedError(`Unauthenticated device`);
            }
            const { refreshToken, accessToken } = this.signTokens(user);
            const refreshTokens = user.refreshTokens;
            refreshTokens.push(refreshToken);
            yield user.save();
            const userToReturn = this.stripUser(user);
            return { user: userToReturn, accessToken, refreshToken };
        });
    }
    initializeSignUp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let pendingUser = yield this.pendingRepo.getOne(email);
            let verificationCode = (0, utils_1.createVerificationCode)(5);
            if (!pendingUser)
                pendingUser = yield this.pendingRepo.create(email, verificationCode);
            else if (pendingUser && pendingUser.verified === true)
                throw new exceptions_1.ForbiddenError(`A user already exists with the email ${email}`);
            else
                yield this.pendingRepo.update(email, { verificationCode });
            return verificationCode;
        });
    }
    signUp(email, name, password, verificationCode, device) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.whereOne({ email });
            if (user)
                throw new exceptions_1.ForbiddenError(`A user already exists with the email ${email}`);
            const pendingUser = yield this.pendingRepo.getOne(email);
            if (!pendingUser)
                throw new exceptions_1.ForbiddenError(`User not initialized!`);
            if (verificationCode !== pendingUser.verificationCode)
                throw new exceptions_1.UnauthorizedError(`User verification failed!`);
            device.verified = true;
            let genWallet;
            let genWalletAddress;
            yield (0, createWallet_1.createWallet)().then((resp) => {
                console.log(resp.data.ETH[0], resp.data.ETH[0].address);
                genWallet = resp.data.ETH[0];
                genWalletAddress = resp.data.ETH[0].address;
            });
            console.log(genWallet);
            const newUser = yield this.repo.createUser({
                email,
                name,
                password,
                verificationCode,
                refreshTokens: [],
                devices: [device],
                wallet: genWallet,
                walletAddress: genWalletAddress
            });
            yield this.pendingRepo.update(email, { verified: true });
            return this.stripUser(newUser);
        });
    }
    verifyDevice(email, device, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.whereOne({ email });
            if (!user)
                throw new exceptions_1.ForbiddenError(`No user found`);
            if (verificationCode !== user.verificationCode)
                throw new exceptions_1.UnauthorizedError(`Invalid verification code!`);
            const devices = user.devices;
            const newDevices = devices.filter((el) => el.ip !== device.ip);
            device.verified = true;
            newDevices.push(device);
            const refreshTokens = user.refreshTokens;
            const { refreshToken, accessToken } = this.signTokens(user);
            refreshTokens.push(refreshToken);
            user.devices = newDevices;
            user.refreshTokens = refreshTokens;
            user.save();
            const userToReturn = this.stripUser(user);
            return { user: userToReturn, accessToken, refreshToken };
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map