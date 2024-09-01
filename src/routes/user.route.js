import { Router } from "express";

import {
  createUser,
  loginUser,
  googleSignin,
  resetPassword,
  refreshAccessToken,
  logoutUser,
} from "../controller/user.controller.js";
import { jwtAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/google-signin").post(googleSignin);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(jwtAuth, logoutUser);

router.route("/reset-password/:user_id").post(resetPassword);

export default router;
