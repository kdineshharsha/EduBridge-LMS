import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizzes",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: Number, // index of the correct option (0,1,2,3)
      required: true,
    },
    explanation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const QuizQuestion = mongoose.model("quizQuestions", quizQuestionSchema);
export default QuizQuestion;
