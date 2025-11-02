import { Router } from "express";
import authControllers from "./auth.controllers";

const router = Router();

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/send-reset-code", authControllers.sendResetCode);
router.post("/reset-password", authControllers.resetPassword);
router.post("/logout", authControllers.logout);

export default router;
