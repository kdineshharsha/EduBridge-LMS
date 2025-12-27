import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lessons",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    timeLimit: {
      type: Number, // minutes
      default: null,
    },
    attemptsAllowed: {
      type: Number,
      default: 1,
    },
    passMark: {
      type: Number, // percentage
      default: 0,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quizQuestions",
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("quizzes", quizSchema);
export default Quiz;
