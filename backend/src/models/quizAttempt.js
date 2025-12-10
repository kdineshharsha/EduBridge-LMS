import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizzes",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "quizQuestions",
        },
        selectedAnswer: {
          type: Number, // index of selected option
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model("quizAttempts", quizAttemptSchema);
export default QuizAttempt;
