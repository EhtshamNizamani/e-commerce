import { Router } from "express";
import { addToCart } from "../controller/cart.controller.js";
import { jwtAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add/:product_id").patch(jwtAuth, addToCart);

export default router;
