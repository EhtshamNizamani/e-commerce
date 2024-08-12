import { Router } from "express";
import { jwtAuth } from "../middlewares/auth.middleware.js";

import {
  order,
  getOrder,
  getAllOrders,
} from "../controller/order.controller.js";
const router = Router();

router.route("/").post(jwtAuth, order);

router.route("/history").get(jwtAuth, getOrder);
router.route("/admin/orders").get(jwtAuth, getAllOrders);

export default router;
