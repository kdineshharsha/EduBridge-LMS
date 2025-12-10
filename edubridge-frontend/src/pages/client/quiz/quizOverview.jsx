import React, { useEffect, useState } from "react";
import { Clock, HelpCircle, PlayCircle, History } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/loader";

export default function QuizOverview() {
  const { id } = useParams(); // quizId from URL
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch quiz + attempts
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/quiz/overview/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuiz(res.data.quiz);
        setAttempts([...res.data.attempts].reverse());
        console.log("Quiz Overview Data:", res.data);
      } catch (error) {
        console.error("Quiz Overview Load Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [id]);

  const formatTimeTaken = (seconds) => {
    if (!seconds || seconds <= 0) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Quiz not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl md:p-8 p-4 py-6 border border-gray-200">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-1">{quiz.description}</p>
        </div>

        {/* QUIZ INFO CARDS */}
        <div className="grid grid-cols-2 md:gap-6 gap-3 mb-10">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2 md:5 flex items-center  gap-4 shadow-sm">
            <Clock className="md:size-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Time Limit</p>
              <p className="md:text-xl font-semibold text-gray-800">
                {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No Limit"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl md:p-5 p-2 flex items-center md:gap-4 gap-3 shadow-sm">
            <HelpCircle className="md:size-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="md:text-xl font-semibold text-gray-800">
                {quiz.questionCount}
              </p>
            </div>
          </div>
        </div>

        {/* PREVIOUS ATTEMPTS */}
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-purple-600" />
          Your Previous Attempts
        </h2>

        {attempts.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 border border-gray-200 rounded-xl md:p-4 p-2 mb-4">
            You haven't attempted this quiz yet.
          </p>
        ) : (
          <div className="space-y-4 mb-10">
            {attempts.map((a, i) => (
              <div
                key={i}
                className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900">Attempt {i + 1}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(a.date).toLocaleString()}
                  </p>

                  {/* ⭐ TIME TAKEN ADDED */}
                  <p className="text-sm text-gray-500">
                    Time Taken:{" "}
                    <span className="font-medium text-gray-700">
                      {formatTimeTaken(a.timeTaken)}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-semibold text-gray-800">
                    Score: <span className="text-purple-600">{a.score}</span> /{" "}
                    {quiz.questionCount}
                  </p>

                  {a.isPassed ? (
                    <span className="mt-1 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                      ✔ Passed
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium">
                      ✘ Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* START QUIZ BUTTON */}
        <div className="text-center">
          <button
            onClick={() => {
              if (!quiz.quizDisabled) navigate(`/quiz/start/${id}`);
            }}
            disabled={quiz.quizDisabled}
            className={`px-8 py-3 font-semibold rounded-xl shadow-md flex items-center gap-2 mx-auto transition
      ${
        quiz.quizDisabled
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.04]"
      }`}
          >
            <PlayCircle className="w-6 h-6" />
            Start Quiz
          </button>

          {/* OPTIONAL WARNING */}
          {quiz.quizDisabled && (
            <p className="text-red-500 text-sm font-medium mt-2">
              You have no attempts left.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
