import express, { urlencoded } from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.CORS_ORIG, credentials: true }));
app.use(urlencoded({ extended: true }));
app.use(express.json());

//imports

//routers
app.use("api/v1/users");

export { app };
