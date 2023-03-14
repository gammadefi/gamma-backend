import express from "express";
// import { validateDevice, validateReqBody } from "../middlewares";
import { UserController, WalletController } from "../controllers";

const walletController = new WalletController();

const router = express.Router();



router.post("/transfer",walletController.sendAssets)

export default router;
