import express from "express";
import {
  addQuestion,
  createQuiz,
  getQuizById,
  getQuizByLesson,
  getQuizWithAttempts,
  submitQuiz,
} from "../controllers/quizController.js";

const quizRouter = express.Router();

quizRouter.post("/create", createQuiz);
quizRouter.post("/add-question", addQuestion);
quizRouter.post("/submit", submitQuiz);
quizRouter.get("/:id", getQuizById);
quizRouter.get("/lesson/:id", getQuizByLesson);
quizRouter.get("/overview/:id", getQuizWithAttempts);

export default quizRouter;
