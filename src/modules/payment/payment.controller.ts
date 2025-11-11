import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import prisma from "../../config/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { catId, name, price, image, userId } = req.body;

    if (!catId || !price) {
      return res.status(400).json({ message: "Нет данных для оплаты" });
    }

    const frontendUrl =
      process.env.FRONTEND_URL ||
      `http://localhost:${process.env.PORT || 3000}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "kgs",
            product_data: { name, images: [image] },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendUrl}/success?catId=${catId}`,
      cancel_url: `${frontendUrl}/cancel`,
      metadata: {
        catId: catId.toString(),
        userId: userId?.toString() || "",
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Ошибка при создании оплаты:", error);
    return res.status(500).json({ message: "Ошибка при создании оплаты" });
  }
};

export const stripeWebhookMiddleware = bodyParser.raw({
  type: "application/json",
}) as (req: Request, res: Response, next: NextFunction) => void;

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Оплата прошла успешно!", session);

    const catId = session.metadata?.catId;
    const userId = session.metadata?.userId;

    if (catId) {
      await prisma.cats.update({
        where: { id: catId },
        data: { status: "sold" },
      });
    }

    console.log({ catId, userId });
  }

  res.json({ received: true });
};

export default { createPayment, stripeWebhook };
