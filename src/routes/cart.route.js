import { Router } from "express";
import {
  addToCart,
  getCartProduct,
  removeCartProduct,
  removeQuantityOfProduct,
} from "../controller/cart.controller.js";
import { jwtAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add/:product_id").patch(jwtAuth, addToCart);
router.route("/delete/:product_id").delete(jwtAuth, removeCartProduct);
router.route("/decrease/:product_id").delete(jwtAuth, removeQuantityOfProduct);

router.route("/get").get(jwtAuth, getCartProduct);

export default router;
