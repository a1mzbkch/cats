import { Router } from "express";
import createPayment, {
  stripeWebhook,
  stripeWebhookMiddleware,
} from "./payment.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createPayment.createPayment);
router.post("/webhook", stripeWebhookMiddleware, stripeWebhook);

export default router;
