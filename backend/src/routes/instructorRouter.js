import e from "express";
import express from "express";
import {
  getStudentOverviewByInstructor,
  getStudentsByInstructor,
} from "../controllers/instructorController.js";

const instructorRouter = express.Router();

instructorRouter.get("/students", getStudentsByInstructor);
instructorRouter.get("/students/:id", getStudentOverviewByInstructor);

export default instructorRouter;
