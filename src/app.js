import express, { urlencoded } from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.CORS_ORIG, credentials: true }));
app.use(urlencoded({ extended: true }));
app.use(express.json());

//imports
import userRouter from "../src/routes/user.route.js";
import adminRouter from "../src/routes/admin.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import favoriteRouter from "./routes/favorite.route.js";
import orderRouter from "./routes/order.route.js";

//routers

//User
app.use("/api/v1/users", userRouter);

//Admin
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/favorite", favoriteRouter);
app.use("/api/v1/order", orderRouter);

export { app };
