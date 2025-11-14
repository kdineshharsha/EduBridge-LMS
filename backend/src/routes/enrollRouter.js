import express from "express";
import { enrollAfterPayment } from "../controllers/enrollController.js";

const enrollRouter = express.Router();

enrollRouter.post("/after-payment", enrollAfterPayment);

export default enrollRouter;
