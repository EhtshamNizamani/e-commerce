import { Router } from "express";
import { jwtAuth } from "../middlewares/auth.middleware.js";
import { toggleFavorite } from "../controller/favorite.controller.js";
const router = Router();

router.route("/:product_id").post(jwtAuth, toggleFavorite);

export default router;
