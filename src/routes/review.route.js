import { jwtAuth } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { addReview } from "../controller/review.controller.js";

const router = Router();

router.route("/add-review/:product_id").post(jwtAuth, addReview);

export default router;
