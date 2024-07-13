import { app } from "../app.js";
import { Router } from "express";
import { createUser } from "../controller/user.controller.js";
const router = Router();

router.route();

router.route("/").post(createUser);
