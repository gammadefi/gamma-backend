import express from "express";
import { SettingsController } from "../controllers";
import { createSettingsSchema, updateSettingsSchema } from "../validations";
import { checkResources, validateReqBody, validateJwt } from "../middlewares";

const settingsController = new SettingsController();

const router = express.Router();

router.use(validateJwt());
router.use(checkResources("admin"));

router
  .route("/")
  .get(settingsController.get)
  .patch(validateReqBody(updateSettingsSchema), settingsController.update)
  .post(validateReqBody(createSettingsSchema), settingsController.create);

  export default router;
