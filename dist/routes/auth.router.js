"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const controllers_1 = require("../controllers");
const authController = new controllers_1.AuthController();
const router = express_1.default.Router();
router.post("/init", (0, middlewares_1.validateReqBody)(validations_1.initRegSchema), authController.initReg);
router.use((0, middlewares_1.validateDevice)());
router.post("/register", (0, middlewares_1.validateReqBody)(validations_1.registerSchema), authController.register);
router.post("/login", (0, middlewares_1.validateReqBody)(validations_1.loginSchema), authController.login);
router.post("/device/verify", (0, middlewares_1.validateReqBody)(validations_1.verifyDeviceSchema), authController.verifyDevice);
exports.default = router;
//# sourceMappingURL=auth.router.js.map