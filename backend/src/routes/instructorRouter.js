import e from "express";
import express from "express";
import {
  getStudentOverviewByInstructor,
  getStudentsByInstructor,
} from "../controllers/instructorController.js";
import {
  getDailyRevenue,
  instructorRevenueChart,
  instructorSummary,
} from "../controllers/instructorSummary.js";

const instructorRouter = express.Router();

instructorRouter.get("/students", getStudentsByInstructor);
instructorRouter.get("/students/:id", getStudentOverviewByInstructor);
instructorRouter.get("/summary", instructorSummary);
instructorRouter.get("/revenue-chart", getDailyRevenue);

export default instructorRouter;
