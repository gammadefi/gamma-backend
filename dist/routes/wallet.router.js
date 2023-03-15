"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const walletController = new controllers_1.WalletController();
const router = express_1.default.Router();
router.post("/transfer", walletController.sendAssets);
exports.default = router;
//# sourceMappingURL=wallet.router.js.map