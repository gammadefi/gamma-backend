import express from "express";
import { validateDevice, validateReqBody } from "../middlewares";
import {initRegSchema, registerSchema, loginSchema, verifyDeviceSchema} from '../validations'
import { AuthController } from "../controllers";

const authController = new AuthController();

const router = express.Router();

router.post("/init", validateReqBody(initRegSchema), authController.initReg);

router.use(validateDevice());

router.post("/register", validateReqBody(registerSchema), authController.register);
router.post("/login", validateReqBody(loginSchema), authController.login);
router.post("/device/verify", validateReqBody(verifyDeviceSchema), authController.verifyDevice);

export default router;