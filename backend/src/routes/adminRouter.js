import express from "express";
import {
  adminRevenueChart,
  adminSummary,
  getUserRoleSummary,
} from "../controllers/adminSummary.js";

const adminRouter = express.Router();

adminRouter.get("/summary", adminSummary);
adminRouter.get("/revenue-chart", adminRevenueChart);
adminRouter.get("/user-summary", getUserRoleSummary);

export default adminRouter;
