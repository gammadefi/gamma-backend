"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const validations_1 = require("../validations");
const middlewares_1 = require("../middlewares");
const settingsController = new controllers_1.SettingsController();
const router = express_1.default.Router();
router.use((0, middlewares_1.validateJwt)());
router.use((0, middlewares_1.checkResources)("admin"));
router
    .route("/")
    .get(settingsController.get)
    .patch((0, middlewares_1.validateReqBody)(validations_1.updateSettingsSchema), settingsController.update)
    .post((0, middlewares_1.validateReqBody)(validations_1.createSettingsSchema), settingsController.create);
exports.default = router;
//# sourceMappingURL=settings.router.js.map