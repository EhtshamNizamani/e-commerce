import { Router } from "express";
import { jwtAuth } from "../middlewares/auth.middleware.js";

import { order, getOrder } from "../controller/order.controller.js";
const router = Router();

router.route("/:product_id").post(jwtAuth, order);
router.route("/history").get(jwtAuth, getOrder);

export default router;
