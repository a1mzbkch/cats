import { Router } from "express";
import cors from "cors";
import authRoutes from "../modules/auth/auth.routes";
import catsRoutes from "../modules/cats/cats.routes";
import favoriteRoutes from "../modules/favorite/favorite.routes";
import paymentRoutes from "../modules/payment/payment.routes";

const globalRouter = Router();

const corsConfig = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://cats-front-cnq4.vercel.app",
    "https://cats-front-eight.vercel.app",
  ],
};

globalRouter.use("/auth", cors(corsConfig), authRoutes);
globalRouter.use("/shop", cors(corsConfig), catsRoutes);
globalRouter.use("/shop", cors(corsConfig), favoriteRoutes);
globalRouter.use("/payment", cors(corsConfig), paymentRoutes);

export default globalRouter;
