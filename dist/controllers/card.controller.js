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
const config_1 = require("../config");
const services_1 = require("../services");
const flutterwave_service_1 = require("src/services/flutterwave.service");
const utils_1 = require("../utils");
class cardController {
    constructor() {
        this.createVCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { amount } = req.body;
            try {
                const body = {
                    currency: "USD",
                    amount,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dob: user.dob,
                    email: user.email,
                    title: user.title,
                    gender: user.gender,
                    phone: user.phone
                };
                const createV = yield (0, flutterwave_service_1.createVirtualCard)(body);
                const data = {
                    privateKey: user.wallet[0].key,
                    toAddress: config_1.APP_WALLET_ADDRESS,
                    fromAddress: user.wallet[0].address,
                    amount
                };
                const transfer = yield (0, utils_1.sendNativeCoin)(data);
                return res.status(200).json({ status: "success", message: "card created successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.fundVCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ status: "success", message: "card created successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllVcard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ status: "success", message: "fetched successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.service = new services_1.UserService;
    }
}
exports.default = cardController;
//# sourceMappingURL=card.controller.js.map