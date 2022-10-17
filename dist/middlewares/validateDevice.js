"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const isip_1 = __importDefault(require("isip"));
exports.default = () => {
    return (req, res, next) => {
        try {
            const { devicename, deviceip } = req.headers;
            if (!devicename || !deviceip)
                throw new exceptions_1.UnauthorizedError(`Device details not passed in request headers!`);
            if (!(0, isip_1.default)(deviceip))
                throw new exceptions_1.UnauthorizedError(`Invalid Ip address`);
            req.device = {
                name: devicename,
                ip: deviceip,
                verified: false,
            };
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
//# sourceMappingURL=validateDevice.js.map