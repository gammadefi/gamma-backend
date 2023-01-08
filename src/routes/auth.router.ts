import express from "express";
import { validateDevice, validateReqBody, validateJwt } from "../middlewares";
import {
  initRegSchema,
  registerSchema,
  loginSchema,
  verifyDeviceSchema,
  updateEmailorPhoneSchema,
  verifyPhoneOrMailSchema,
} from "../validations";
import { AuthController } from "../controllers";

const authController = new AuthController();

const router = express.Router();

router.post("/init", validateReqBody(initRegSchema), authController.initReg);

router.use(validateDevice());

router.post("/register", validateReqBody(registerSchema), authController.register);
router.post("/login", validateReqBody(loginSchema), authController.login);
router.post("/device/verify", validateReqBody(verifyDeviceSchema), authController.verifyDevice);

router.use(validateJwt());

router.post("/sendcode/:channel", authController.sendCode);
router.patch(
  "/me/email",
  validateReqBody(updateEmailorPhoneSchema),
  authController.updatePhoneOrMail("email")
);
router.patch(
  "/me/phone",
  validateReqBody(updateEmailorPhoneSchema),
  authController.updatePhoneOrMail("phone")
);
router.post(
  "/me/verify/email",
  validateReqBody(verifyPhoneOrMailSchema),
  authController.verifyPhoneOrMail("email")
);
router.post(
  "/me/verify/phone",
  validateReqBody(verifyPhoneOrMailSchema),
  authController.verifyPhoneOrMail("phone")
);

export default router;