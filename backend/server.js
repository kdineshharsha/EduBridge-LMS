import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import verifyJWT from "./src/middleware/auth.js";
import userRouter from "./src/routes/userRouter.js";

const port = 3000;
const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(verifyJWT);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
