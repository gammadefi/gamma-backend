import express from "express";
import { validateDevice, validateReqBody, validateJwt } from "../middlewares";
import {
  initRegSchema,
  registerSchema,
  loginSchema,
  verifyDeviceSchema,
  updateEmailorPhoneSchema,
  verifyPhoneOrMailSchema,
  registerAdminSchema
} from "../validations";
import { AuthController } from "../controllers";

const authController = new AuthController();

const router = express.Router();

router.post("/init", validateReqBody(initRegSchema), authController.initReg);

router.post("/admin/register", validateReqBody(registerAdminSchema), authController.registerAdmin)

router.use(validateDevice());


router.post("/register", validateReqBody(registerSchema), authController.register);

router.post("/login", validateReqBody(loginSchema), authController.login("user"));
router.post("/admin/login", validateReqBody(loginSchema), authController.login("admin"))

router.post("/device/verify", validateReqBody(verifyDeviceSchema), authController.verifyDevice("user"));
router.post("/admin/device/verify", validateReqBody(verifyDeviceSchema), authController.verifyDevice("admin"))



router.use(validateJwt());


router.post("/sendcode/:channel", authController.sendCode("user"));
router.post("/admin/sendcode/:channel", authController.sendCode("admin"));

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