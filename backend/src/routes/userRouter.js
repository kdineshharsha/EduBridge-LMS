import express from "express";
import { saveUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", saveUser);

export default userRouter;
