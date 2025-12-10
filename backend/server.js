import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import verifyJWT from "./src/middleware/auth.js";
import userRouter from "./src/routes/userRouter.js";
import courseRouter from "./src/routes/courseRouter.js";
import lessonRouter from "./src/routes/lessonRouter.js";
import reviewRouter from "./src/routes/reviewRouter.js";
import contactRouter from "./src/routes/contactRouter.js";
import enrollRouter from "./src/routes/enrollRouter.js";
import paymentRouter from "./src/routes/paymentRouter.js";
import quizRouter from "./src/routes/quizRouter.js";

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
app.use("/api/course", courseRouter);
app.use("/api/review", reviewRouter);
app.use("/api/contact", contactRouter);
app.use("/api/course/lesson", lessonRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/enroll", enrollRouter);
app.use("/api/quiz", quizRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
