import { Router } from "express";
import { addToCart, getCartProduct } from "../controller/cart.controller.js";
import { jwtAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add/:product_id").patch(jwtAuth, addToCart);
router.route("/get").get(jwtAuth, getCartProduct);

export default router;
