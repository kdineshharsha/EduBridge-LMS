import express from "express";
import {
  createLesson,
  deleteLessonById,
  getAllLessons,
} from "../controllers/lessonController.js";

const lessonRouter = express.Router();

lessonRouter.get("/all", getAllLessons);
lessonRouter.post("/create", createLesson);
lessonRouter.delete("/delete/:id", deleteLessonById);

export default lessonRouter;
