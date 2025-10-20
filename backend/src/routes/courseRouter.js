import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseByInstructor,
  updateCourse,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.get("/", getAllCourses);
courseRouter.post("/create", createCourse);
courseRouter.get("/:id", getCourseById);
courseRouter.get("/instructor/:id", getCourseByInstructor);
courseRouter.put("/update/:id", updateCourse);

export default courseRouter;
