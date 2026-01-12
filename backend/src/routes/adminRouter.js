import express from "express";
import {
  adminRevenueChart,
  adminSummary,
  adminTopCourses,
  getUserRoleSummary,
} from "../controllers/adminSummary.js";
import {
  getAdminCourseDetails,
  getAllUsersForAdmin,
  getUserOverview,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/summary", adminSummary);
adminRouter.get("/revenue-chart", adminRevenueChart);
adminRouter.get("/user-summary", getUserRoleSummary);
adminRouter.get("/users", getAllUsersForAdmin);
adminRouter.get("/top-courses", adminTopCourses);
adminRouter.get("/users/:id", getUserOverview);
adminRouter.get("/course-manage/:id", getAdminCourseDetails);

export default adminRouter;
