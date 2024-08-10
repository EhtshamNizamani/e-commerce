import { Router } from "express";
import { jwtAuth } from "../middlewares/auth.middleware.js";

import { order } from "../controller/order.controller.js";
const router = Router();

router.route("/:product_id").post(jwtAuth, order);

export default router;
