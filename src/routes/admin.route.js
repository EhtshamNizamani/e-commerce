import { Router } from "express";
import { createAdmin, adminLogin } from "../controller/admin.controller.js";
const router = Router();

router.route("/register").post(createAdmin);
router.route("/login").post(adminLogin);

export default router;
