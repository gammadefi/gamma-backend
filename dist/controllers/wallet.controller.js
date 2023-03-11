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
const utils_1 = require("../utils");
utils_1.transferAsset;
class walletCOntroller {
    constructor() {
        this.sendMatic = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { amount, to } = req.body;
            try {
                const data = {
                    privateKey: user.wallet[0].key,
                    toAddress: to,
                    fromAddress: user.wallet[0].address,
                    amount
                };
                const transfer = yield (0, utils_1.sendNativeCoin)(data);
                return res.status(200).json({ status: "success", data: transfer });
            }
            catch (error) {
                next(error);
            }
        });
        this.service = new services_1.UserService();
    }
}
exports.default = walletCOntroller;
//# sourceMappingURL=wallet.controller.js.map