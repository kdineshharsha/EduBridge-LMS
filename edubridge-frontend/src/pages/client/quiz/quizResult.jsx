import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function QuizResult() {
  const quizId = useParams().id;
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Quiz Result Location State:", location.state);
  console.log("Quiz ID from Params:", quizId);

  // result comes from backend submitQuiz controller
  const { result } = location.state || {};

  if (!result) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No result data found.</p>
      </div>
    );
  }

  // backend values
  const score = result.score;
  const total = result.total;
  const percentage = Math.round(result.percentage);
  const passed = result.isPassed;
  const questions = result.questions; // detailedResults from backend

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
        </div>

        {/* SCORE CARD */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Your Score
          </h2>

          <p className="text-5xl font-bold text-purple-600">{percentage}%</p>
          <p className="text-lg text-gray-700 mt-2">
            {score} out of {total} correct
          </p>

          <div className="mt-4">
            {passed ? (
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
                <CheckCircle className="w-5 h-5" /> Passed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold">
                <XCircle className="w-5 h-5" /> Failed
              </span>
            )}
          </div>
        </div>

        {/* RESULTS LIST */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.questionId}
              className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
            >
              {/* Question Title */}
              <h3 className="font-semibold text-gray-900 text-lg mb-3">
                {index + 1}. {q.questionText}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-sm transition ${
                      // Correct answer highlight
                      i === q.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : // User selected wrong answer
                        i === q.selectedAnswer
                        ? "border-red-500 bg-red-50"
                        : // Normal options
                          "border-gray-300 bg-gray-50"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>

              {/* Correct / Wrong */}
              <div className="mt-4">
                {q.isCorrect ? (
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Correct
                  </p>
                ) : (
                  <p className="text-red-600 font-medium flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Wrong
                  </p>
                )}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <p className="mt-3 text-gray-700 text-sm bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <span className="font-semibold text-purple-700">
                    Explanation:{" "}
                  </span>
                  {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* BACK TO COURSE */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(`/quiz/overview/${quizId}`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition"
          >
            Back to Course
          </button>
        </div>
      </div>
    </div>
  );
}
