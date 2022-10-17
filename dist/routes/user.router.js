"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const userController = new controllers_1.UserController();
const router = express_1.default.Router();
router.get("/", userController.getAll);
router.get("/pending", userController.getAllPending);
router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUser);
router.get("/pending/email/:email", userController.getAPendingUser);
exports.default = router;
//# sourceMappingURL=user.router.js.map