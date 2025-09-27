import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  saveUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/register", saveUser);
userRouter.post("/login", loginUser);
userRouter.get("/:email", getUserById);
userRouter.delete("/delete", deleteUser);

export default userRouter;
