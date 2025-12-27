import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Loader from "../../../components/loader";
import { useAuth } from "../../../context/AuthContext";

export default function QuizPage() {
  const quizId = useParams().id;
  const navigate = useNavigate();
  const { token } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/quiz/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuiz(res.data.quiz);
        console.log("Fetched Quiz:", res.data.quiz);
        // 🕒 If quiz has a time limit (in minutes)
        if (res.data.quiz.timeLimit) {
          setTimeLeft(res.data.quiz.timeLimit * 60); // convert minutes → seconds
          setTimerActive(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!timerActive || timeLeft === null) return;

    if (timeLeft === 0) {
      handleSubmit(); // auto submit when timer hits zero
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Quiz not found.</p>
      </div>
    );
  }

  const question = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map(
        (questionId) => ({
          questionId,
          selectedAnswer: selectedAnswers[questionId],
        })
      );
      const timeTaken = quiz.timeLimit * 60 - timeLeft; // in seconds
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit`,
        {
          quizId,
          answers: formattedAnswers,
          timeTaken,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/quiz/result/${quizId}`, {
        state: { result: res.data },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        {/* Quiz Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>

          <div className="flex items-center gap-2 text-purple-600 font-bold text-lg">
            <Clock className="w-5 h-5" />
            {quiz.timeLimit ? (
              <span>⏳ {formatTime(timeLeft)}</span>
            ) : (
              <span>No time limit</span>
            )}
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="text-gray-700 font-semibold text-lg mb-3">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <p className="text-gray-900 text-xl font-medium">
            {question.questionText}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((opt, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedAnswers[question._id] === index
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400"
                }`}
            >
              <input
                type="radio"
                name={question._id}
                value={index}
                checked={selectedAnswers[question._id] === index}
                onChange={() => handleOptionSelect(question._id, index)}
                className="w-5 h-5 accent-purple-600"
              />
              <span className="text-gray-700">{opt}</span>
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-5 py-2 font-semibold rounded-xl border ${currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white font-semibold rounded-xl shadow hover:scale-105 transition-all"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 font-semibold rounded-xl hover:bg-blue-700 shadow"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
