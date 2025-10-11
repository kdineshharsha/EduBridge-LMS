import express from "express";
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  googleLogin,
  loginUser,
  saveUser,
  sendOTP,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/current", getCurrentUser);
userRouter.post("/register", saveUser);
userRouter.post("/google", googleLogin);
userRouter.post("/login", loginUser);
userRouter.get("/:email", getUserById);
userRouter.delete("/delete", deleteUser);
userRouter.post("/sendMail", sendOTP);
userRouter.put("/changePassword", changePassword);

export default userRouter;
