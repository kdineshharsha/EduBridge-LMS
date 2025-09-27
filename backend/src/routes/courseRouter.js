import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseByInstructor,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.get("/", getAllCourses);
courseRouter.post("/create", createCourse);
courseRouter.get("/:id", getCourseById);
courseRouter.get("/instructor/:id", getCourseByInstructor);

export default courseRouter;
