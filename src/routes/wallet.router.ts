import express from "express";
import { validateDevice, validateJwt, validateReqBody } from "../middlewares";
import { UserController, WalletController } from "../controllers";
import { transferSchema } from "../validations";

const walletController = new WalletController();

const router = express.Router();

router.use(validateJwt());



router.post("/transfer",validateReqBody(transferSchema),walletController.sendAssets)

export default router;
