import express from "express";
import {
  createLesson,
  deleteLessonById,
  getAllLessons,
  updateLesson,
} from "../controllers/lessonController.js";

const lessonRouter = express.Router();

lessonRouter.get("/all", getAllLessons);
lessonRouter.post("/create", createLesson);
lessonRouter.put("/update/:id", updateLesson);
lessonRouter.delete("/delete/:id", deleteLessonById);

export default lessonRouter;
