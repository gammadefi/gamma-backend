import express from "express";
// import { validateDevice, validateReqBody } from "../middlewares";
import { UserController } from "../controllers";

const userController = new UserController();

const router = express.Router();

router.get("/", userController.getAll);
router.get("/pending", userController.getAllPending);
router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUser);
router.get("/pending/email/:email", userController.getAPendingUser);

export default router;
