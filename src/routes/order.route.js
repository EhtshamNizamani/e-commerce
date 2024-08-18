import { Router } from "express";
import { jwtAuth } from "../middlewares/auth.middleware.js";

import {
  order,
  getOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controller/order.controller.js";
const router = Router();

router.route("/").post(jwtAuth, order);

router.route("/history").get(jwtAuth, getOrder);
router.route("/admin/orders").get(jwtAuth, getAllOrders);
router.route("/single-order/:orderId").get(jwtAuth, getSingleOrder);
router.route("/update-status/:orderId").post(jwtAuth, updateOrderStatus);

export default router;
