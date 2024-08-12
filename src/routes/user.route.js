import { jwtAuth } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {
  createUser,
  loginUser,
  googleSignin,
  resetPassword,
} from "../controller/user.controller.js";

const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/google-signin").post(googleSignin);

router.route("/reset-password/:user_id").post(resetPassword);

export default router;
