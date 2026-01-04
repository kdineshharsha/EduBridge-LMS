import e from "express";
import express from "express";
import {
  getStudentOverviewByInstructor,
  getStudentsByInstructor,
} from "../controllers/instructorController.js";
import {
  getCourseHealth,
  getDailyRevenue,
  getLatestFeedback,
  getTopCourses,
  instructorRevenueChart,
  instructorSummary,
} from "../controllers/instructorSummary.js";

const instructorRouter = express.Router();

instructorRouter.get("/students", getStudentsByInstructor);
instructorRouter.get("/students/:id", getStudentOverviewByInstructor);
instructorRouter.get("/summary", instructorSummary);
instructorRouter.get("/revenue-chart", getDailyRevenue);
instructorRouter.get("/top-courses", getTopCourses);
instructorRouter.get("/course-health", getCourseHealth);
instructorRouter.get("/latest-feedback", getLatestFeedback);

export default instructorRouter;
