import { Router } from "express";
import catController from "./cats.controllers";

const router = Router();

router.get("/cats", catController.getAllCats);
router.get("/cats/:id", catController.getCatById);
router.post("/cats", catController.addCat);
router.patch("/cats/:id", catController.updateCat);
router.put("/cats/:id", catController.replaceCat);

export default router;
