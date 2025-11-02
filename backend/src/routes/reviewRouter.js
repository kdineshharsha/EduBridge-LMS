import express from "express";
import {
  createReview,
  deleteReviewById,
  editReviewById,
  getAllReviews,
} from "../controllers/reviewController.js";
import { getReviewsByCourseId } from "../controllers/reviewController.js";
const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/:id", getReviewsByCourseId);
reviewRouter.put("/:id", editReviewById);
reviewRouter.delete("/:id", deleteReviewById);

export default reviewRouter;
