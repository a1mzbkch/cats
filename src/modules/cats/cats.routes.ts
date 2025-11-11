import { Router } from "express";
import catController from "./cats.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.get("/cats", catController.getAllCats);
router.get("/cats/:id", catController.getCatById);
router.post("/cats", authMiddleware, catController.addCat);
router.patch("/cats/:id", authMiddleware, catController.updateCat);
router.put("/cats/:id", authMiddleware, catController.replaceCat);
router.delete("/cats", authMiddleware, catController.deleteCat);

export default router;
