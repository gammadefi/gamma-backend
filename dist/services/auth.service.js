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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const exceptions_1 = require("../exceptions");
const utils_1 = require("../utils");
const config_1 = require("../config");
const createWallet_1 = require("./api/createWallet");
const moment_1 = __importDefault(require("moment"));
class AuthService {
    constructor() {
        this.repo = new repositories_1.UserRepo();
        this.pendingRepo = new repositories_1.PendingUserRepo();
        this.adminRepo = new repositories_1.AdminRepo();
        this.settingsRepo = new repositories_1.SettingsRepo();
    }
    stripUser(resource, resourceType) {
        if (resourceType === "user") {
            const _a = resource._doc, { password, refreshTokens, devices } = _a, restOfUser = __rest(_a, ["password", "refreshTokens", "devices"]);
            return restOfUser;
        }
        else {
            const _b = resource
                ._doc, { password, refreshTokens } = _b, restOfAdmin = __rest(_b, ["password", "refreshTokens"]);
            return restOfAdmin;
        }
    }
    getVerificationCodeExpiry() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield this.settingsRepo.get();
            const verificationCodeExpiry = !settings
                ? 10
                : settings.verificationCodeExpiry;
            return verificationCodeExpiry;
        });
    }
    checkExpiryTime(time) {
        if ((0, moment_1.default)().isAfter(time))
            throw new exceptions_1.UnauthorizedError(`Verification code expired!`);
    }
    signTokens(resource, resourceType) {
        const dataToSign = { id: resource._id, resourceType };
        const accessToken = (0, utils_1.signJWT)(dataToSign, config_1.ACCESS_TOKEN_SECRET, config_1.ACCESS_TOKEN_EXPIRY);
        const refreshToken = (0, utils_1.signJWT)(dataToSign, config_1.REFRESH_TOKEN_SECRET, config_1.REFRESH_TOKEN_EXPIRY);
        return { refreshToken, accessToken };
    }
    login(email, password, device, resourceType) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource;
            if (resourceType === "user")
                resource = yield this.repo.whereOne({ email });
            else
                resource = yield this.adminRepo.whereOne({ email });
            if (!resource || !resource.comparePassword(password))
                throw new exceptions_1.UnauthorizedError(`No ${resourceType} found with email or password!`);
            const devices = resource.devices;
            let deviceFound = false;
            devices.map((el) => {
                if (el.ip === device.ip &&
                    el.name === device.name &&
                    el.verified === true)
                    deviceFound = true;
            });
            if (!deviceFound) {
                const verificationCodeExpiry = yield this.getVerificationCodeExpiry();
                const verificationData = (0, utils_1.createVerificationCode)(5, verificationCodeExpiry);
                const dataToUpdate = {
                    verificationCode: verificationData.verificationCode,
                    verificationExpiry: verificationData.expiryTimeInMinutes,
                };
                if (resourceType === "user")
                    yield this.repo.update(resource._id, dataToUpdate);
                else
                    yield this.adminRepo.update(resource._id, dataToUpdate);
                throw new exceptions_1.UnauthorizedError(`Unauthenticated device`);
            }
            const { refreshToken, accessToken } = this.signTokens(resource, resourceType);
            const refreshTokens = resource.refreshTokens;
            refreshTokens.push(refreshToken);
            yield resource.save();
            const resourceToReturn = this.stripUser(resource, resourceType);
            const dataToReturn = { accessToken, refreshToken };
            if (resourceType === "user")
                dataToReturn.user = resourceToReturn;
            else
                dataToReturn.admin = resourceToReturn;
            return dataToReturn;
        });
    }
    signupAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminRepo.whereOne({ email });
            if (admin)
                throw new exceptions_1.ForbiddenError(`An admin already exists with the email ${email}`);
            const newAdmin = yield this.adminRepo.createUser({
                email,
                password,
                refreshTokens: [],
                actions: [],
                active: true,
                verificationCode: "",
                devices: [],
            });
            return this.stripUser(newAdmin, "admin");
        });
    }
    initializeSignUp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let pendingUser = yield this.pendingRepo.getOne(email);
            const verificationCodeExpiry = yield this.getVerificationCodeExpiry();
            let verificationData = (0, utils_1.createVerificationCode)(5, verificationCodeExpiry);
            if (!pendingUser)
                pendingUser = yield this.pendingRepo.create(email, verificationData.verificationCode, verificationData.expiryTimeInMinutes);
            else if (pendingUser && pendingUser.verified === true)
                throw new exceptions_1.ForbiddenError(`A user already exists with the email ${email}`);
            else
                yield this.pendingRepo.update(email, {
                    verificationCode: verificationData.verificationCode,
                    verificationExpiry: verificationData.expiryTimeInMinutes,
                });
            return verificationData.verificationCode;
        });
    }
    signUp(email, firstName, lastName, dob, title, gender, password, verificationCode, device) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.whereOne({ email });
            if (user)
                throw new exceptions_1.ForbiddenError(`A user already exists with the email ${email}`);
            const pendingUser = yield this.pendingRepo.getOne(email);
            if (!pendingUser)
                throw new exceptions_1.ForbiddenError(`User not initialized!`);
            if (verificationCode !== pendingUser.verificationCode)
                throw new exceptions_1.UnauthorizedError(`User verification failed!`);
            this.checkExpiryTime(pendingUser.verificationExpiry);
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
                firstName,
                lastName,
                dob,
                title,
                gender,
                password,
                verificationCode,
                refreshTokens: [],
                devices: [device],
                wallet: [genWallet],
                walletAddress: genWalletAddress,
            });
            yield this.pendingRepo.update(email, { verified: true });
            return this.stripUser(newUser, "user");
        });
    }
    sendCode(channel, value, resourceType) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource;
            if (resourceType === "admin")
                resource = yield this.adminRepo.whereOne({ email: value });
            else {
                if (channel === "email")
                    resource = yield this.repo.whereOne({ email: value });
                else
                    resource = yield this.repo.whereOne({ phone: value });
            }
            if (!resource)
                throw new exceptions_1.NotFoundError(`No ${resourceType} found with phone number or email!`);
            const verificationCodeExpiry = yield this.getVerificationCodeExpiry();
            const verificationData = (0, utils_1.createVerificationCode)(5, verificationCodeExpiry);
            const dataToUpdate = {
                verificationCode: verificationData.verificationCode,
                verificationExpiry: verificationData.expiryTimeInMinutes,
            };
            if (resourceType === "user")
                yield this.repo.update(resource._id, dataToUpdate);
            else
                yield this.adminRepo.update(resource._id, dataToUpdate);
            return true;
        });
    }
    updatePhoneOrEmail(channel, value, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingUser;
            let pendingElUser;
            const verificationCodeExpiry = yield this.getVerificationCodeExpiry();
            const verificationData = (0, utils_1.createVerificationCode)(5, verificationCodeExpiry);
            let updateFields = {
                verificationCode: verificationData.verificationCode,
                verificationExpiry: verificationData.expiryTimeInMinutes,
            };
            let pendingElUserUpdateFields = {};
            if (channel === "email") {
                existingUser = yield this.repo.whereOne({ email: value });
                pendingElUser = yield this.repo.whereOne({ pendingEmail: value });
                pendingElUserUpdateFields.pendingEmail = "";
                updateFields.pendingEmail = value;
            }
            else {
                existingUser = yield this.repo.whereOne({ phone: value });
                pendingElUser = yield this.repo.whereOne({ pendingPhone: value });
                pendingElUserUpdateFields.pendingPhone = "";
                updateFields.pendingPhone = value;
            }
            if (existingUser)
                throw new exceptions_1.ForbiddenError(`A user already exists with this ${channel}`);
            if (pendingElUser)
                yield this.repo.update(pendingElUser._id, pendingElUserUpdateFields);
            updateFields.lastSensitiveInfoUpdateTime = new Date(Date.now());
            yield this.repo.update(userId, updateFields);
            return true;
        });
    }
    verifyPhoneOrMail(channel, verificationCode, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter;
            let updateFields = { verificationCode: "" };
            if (channel === "phone") {
                filter = { pendingPhone: value };
                updateFields = Object.assign(Object.assign({}, updateFields), { phone: value, pendingPhone: "", phoneVerified: true });
            }
            else {
                filter = { pendingEmail: value };
                updateFields = Object.assign(Object.assign({}, updateFields), { email: value, pendingEmail: "" });
            }
            const user = yield this.repo.whereOne(filter);
            if (!user)
                throw new exceptions_1.NotFoundError("No user found with phone number or email");
            if (verificationCode != user.verificationCode)
                throw new exceptions_1.UnauthorizedError(`Invalid verification code!`);
            this.checkExpiryTime(user.verificationExpiry);
            updateFields.lastSensitiveInfoUpdateTime = new Date(Date.now());
            const updatedUser = yield this.repo.update(user._id, updateFields);
            return this.stripUser(updatedUser, "user");
        });
    }
    verifyDevice(email, device, verificationCode, resourceType) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource;
            if (resourceType === "user")
                resource = yield this.repo.whereOne({ email });
            else
                resource = yield this.adminRepo.whereOne({ email });
            if (!resource)
                throw new exceptions_1.ForbiddenError(`No user found`);
            if (verificationCode !== resource.verificationCode)
                throw new exceptions_1.UnauthorizedError(`Invalid verification code!`);
            const devices = resource.devices;
            const newDevices = devices.filter((el) => el.ip !== device.ip);
            device.verified = true;
            newDevices.push(device);
            const refreshTokens = resource.refreshTokens;
            const { refreshToken, accessToken } = this.signTokens(resource, resourceType);
            refreshTokens.push(refreshToken);
            resource.devices = newDevices;
            resource.refreshTokens = refreshTokens;
            resource.verificationCode = "";
            resource.save();
            const userToReturn = this.stripUser(resource, resourceType);
            const dataToReturn = { accessToken, refreshToken };
            if (resourceType === "user")
                dataToReturn.user = userToReturn;
            else
                dataToReturn.admin = userToReturn;
            return dataToReturn;
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map