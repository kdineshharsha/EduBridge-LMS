import express from "express";
import {
  createCourse,
  deleteCourse,
  enrollStudent,
  getAllCourses,
  getCourseById,
  getCourseByInstructor,
  getCoursesbyStudentId,
  updateCourse,
} from "../controllers/courseController.js";
import verifyJWT from "../middleware/auth.js";

const courseRouter = express.Router();

courseRouter.get("/", getAllCourses);
courseRouter.post("/create", createCourse);
courseRouter.get("/:id", getCourseById);
courseRouter.delete("/:id", deleteCourse);

courseRouter.get("/instructor/:id", getCourseByInstructor);
courseRouter.put("/update/:id", updateCourse);
courseRouter.post("/enroll/:id", enrollStudent);
courseRouter.get("/enrolled-courses/:id", getCoursesbyStudentId);

export default courseRouter;
