import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/checkout", createCheckoutSession);

export default paymentRouter;
