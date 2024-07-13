import express, { urlencoded } from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.CORS_ORIG, credentials: true }));
app.use(urlencoded({ extended: true }));
app.use(express.json());

//imports
import userRouter from "../src/routes/user.route.js";
import adminRouter from "../src/routes/admin.route.js";

//routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

export { app };
