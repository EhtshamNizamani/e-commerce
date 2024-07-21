import { jwtAuth } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  editProduct,
  deleteProduct,
  getSingleProduct,
} from "../controller/product.controller.js";
const router = Router();

router.route("/create").post(jwtAuth, createProduct);
router.route("/get").get(jwtAuth, getAllProduct);
router.route("/edit/:product_id").patch(jwtAuth, editProduct);
router.route("/delete/:product_id").delete(jwtAuth, deleteProduct);
router.route("/get-single/:product_id").get(jwtAuth, getSingleProduct);

export default router;
