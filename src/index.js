import connectDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3500, "0.0.0.0", () => {
      console.log("Server is running at port" + process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("MongoDB connection failed:" + e);
  });
