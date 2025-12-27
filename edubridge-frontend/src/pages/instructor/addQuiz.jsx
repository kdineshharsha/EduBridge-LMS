import { useState } from "react";
import { Tag, Clock, CheckCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { FaPlus, FaSpinner, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { TbFileDescription } from "react-icons/tb";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddQuiz() {
    const locationData = useLocation().state;
    const [activeTab, setActiveTab] = useState("details");
    const [loading] = useState(false);

    // Quiz details
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timeLimit, setTimeLimit] = useState("");
    const [attemptsAllowed, setAttemptsAllowed] = useState("");
    const [passMark, setPassMark] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    // Questions
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState("");
    const [explanation, setExplanation] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correct, setCorrect] = useState(0);

    const handleAddQuiz = async () => {
        if (!title.trim()) {
            toast.error("Quiz title is required");
            return;
        }

        if (questions.length === 0) {
            toast.error("Add at least one question");
            return;
        }

        try {
            // 1️⃣ CREATE QUIZ FIRST
            const quizPayload = {
                lessonId: locationData.lessonId,
                title,
                description,
                timeLimit,
                attemptsAllowed,
                passMark,
                isPublished,
            };

            const quizRes = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/quiz/create`,
                quizPayload

            );

            const quizId = quizRes.data.quizId;
            console.log("Created Quiz ID:", quizId);

            for (const q of questions) {
                console.log("Added question:", q.questionText, q.options, " correct answer:", q.correctAnswer, q.explanation);
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/quiz/add-question`,
                    {
                        quizId,
                        questionText: q.questionText,
                        explanation: q.explanation,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                    }
                );
            }

            toast.success("Quiz & questions created successfully 🎉");
            console.log("Quiz ID:", quizId);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create quiz");
        }
    };

    const handleAddQuestion = () => {
        if (!question.trim()) {
            toast.error("Question is required");
            return;
        }

        if (options.some((opt) => !opt.trim())) {
            toast.error("All options are required");
            return;
        }

        const newQuestion = {
            questionText: question,
            explanation,
            options,
            correctAnswer: correct,
        };

        setQuestions((prev) => [...prev, newQuestion]);

        // reset question form
        setQuestion("");
        setExplanation("");
        setOptions(["", "", "", ""]);
        setCorrect(0);

        toast.success("Question added");
        console.log(newQuestion);
    };

    return (
        <div className="w-full overflow-y-scroll scrollbar-hide h-full bg-secondary p-6 rounded-lg shadow-md">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Add Quiz</h1>
            </div>

            {/* Tabs */}
            <div className="flex my-6">
                <button
                    onClick={() => setActiveTab("details")}
                    className={`px-6 py-3 font-semibold transition-all ${activeTab === "details"
                        ? "text-purple-600 border-b-2 border-b-blue-500"
                        : "text-gray-500 hover:text-purple-500 border-b-white border-b-2"
                        }`}
                >
                    Quiz Details
                </button>
                <button
                    onClick={() => setActiveTab("questions")}
                    className={`px-6 py-3 font-semibold transition-all ${activeTab === "questions"
                        ? "text-purple-600 border-b-2 border-b-blue-500"
                        : "text-gray-500 hover:text-purple-500 border-b-white border-b-2"
                        }`}
                >
                    Questions
                </button>
            </div>

            {/* ================= DETAILS TAB ================= */}
            {activeTab === "details" && (
                <div className="p-8 border-2 rounded-lg border-blue-500 space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag className="size-4" /> Lesson Title
                        </label>
                        <input
                            disabled={true}
                            value={locationData.lessonTitle}
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl cursor-not-allowed "
                            placeholder="Enter quiz title..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag className="size-4" /> Quiz Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                            placeholder="Enter quiz title..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <TbFileDescription className="size-4" /> Description
                        </label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock className="size-4" /> Time Limit (mins)
                            </label>
                            <input
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(e.target.value)}
                                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <CheckCircle className="size-4" /> Pass Mark (%)
                            </label>
                            <input
                                value={passMark}
                                onChange={(e) => setPassMark(e.target.value)}
                                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <CheckCircle className="size-4" /> Attempts Allowed
                            </label>
                            <input
                                value={attemptsAllowed}
                                onChange={(e) => setAttemptsAllowed(e.target.value)}
                                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                                placeholder="Default :  ∞"
                            />
                        </div>
                    </div>

                    {/* Publish Toggle */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Eye className="text-blue-500" />
                                <p className="font-medium">Publish Quiz</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPublished(!isPublished)}
                            >
                                {isPublished ? (
                                    <FaToggleOn className="text-blue-500 text-2xl" />
                                ) : (
                                    <FaToggleOff className="text-gray-400 text-2xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleAddQuiz}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaPlus /> Save Quiz
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* ================= QUESTIONS TAB ================= */}
            {activeTab === "questions" && (
                <div className="p-8 border-2 rounded-lg border-blue-500 space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-700">Add Question</h3>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag className="size-4" /> Question
                        </label>
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                            placeholder="Enter question..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag className="size-4" /> Explanation
                        </label>
                        <input
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                            placeholder="Enter explanation..."
                        />
                    </div>

                    {options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <input
                                type="radio"
                                checked={correct === i}
                                onChange={() => setCorrect(i)}
                            />
                            <input
                                value={opt}
                                onChange={(e) => {
                                    const copy = [...options];
                                    copy[i] = e.target.value;
                                    setOptions(copy);
                                }}
                                className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:border-purple-500 focus:outline-none"
                                placeholder={`Option ${i + 1}`}
                            />
                        </div>
                    ))}

                    <button
                        onClick={handleAddQuestion}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-md"
                    >
                        + Add Question
                    </button>

                    {/* Question List UI */}
                    {questions.length > 0 && (
                        <div className="mt-6 space-y-2">
                            <h4 className="text-lg font-semibold text-gray-700">
                                Current Questions ({questions.length})
                            </h4>
                            {questions.map((q, i) => (
                                <div
                                    key={i}
                                    className="border-2 border-gray-200 rounded-lg p-3 flex justify-between items-center"
                                >
                                    <span className="font-medium">
                                        {i + 1}. {q.questionText}
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="border-2 px-3 py-2 rounded-lg border-purple-200 hover:bg-purple-100">
                                            <Pencil className="size-4 text-blue-600" />
                                        </button>
                                        <button className="border-2 px-3 py-2 rounded-lg border-red-200 hover:bg-red-100">
                                            <Trash2 className="size-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
