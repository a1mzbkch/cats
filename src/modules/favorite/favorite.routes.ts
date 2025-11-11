import { Router } from "express";
import favoriteController from "./favorite.controller";

const router = Router();

router.get("/favorite/:userId", favoriteController.getFavorites);
router.post("/favorite/", favoriteController.addFavorite);
router.delete("/favorite/:userId/:catId", favoriteController.deleteFavorite);

export default router;
