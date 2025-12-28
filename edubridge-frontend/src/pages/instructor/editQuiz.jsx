import { useEffect, useState } from "react";
import { Tag, Clock, CheckCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { FaPlus, FaSpinner, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { TbFileDescription } from "react-icons/tb";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditQuiz() {
    const quizId = useParams().id;
    const locationData = useLocation().state || {};

    const [activeTab, setActiveTab] = useState("details");
    const [loading, setLoading] = useState(false);

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
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    // ================= LOAD QUIZ =================
    useEffect(() => {
        async function loadQuiz() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/quiz/${quizId}`
                );

                const quiz = res.data.quiz;

                console.log("Fetched Quiz:", res.data.quiz);

                setTitle(quiz.title);
                setDescription(quiz.description || "");
                setTimeLimit(quiz.timeLimit || "");
                setAttemptsAllowed(quiz.attemptsAllowed || "");
                setPassMark(quiz.passMark || "");
                setIsPublished(quiz.isPublished || false);
                setDescription(quiz.description || "");

                setQuestions(
                    quiz.questions.map((q) => ({
                        _id: q._id,
                        questionText: q.questionText,
                        explanation: q.explanation,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                    }))
                );
            } catch (err) {
                toast.error("Failed to load quiz");
                console.error(err);
            }
        }

        loadQuiz();
    }, [quizId]);

    // ================= UPDATE QUIZ =================
    const handleUpdateQuiz = async () => {
        if (!title.trim()) {
            toast.error("Quiz title is required");
            return;
        }

        try {
            setLoading(true);
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/quiz/update/${quizId}`,
                {
                    title,
                    description,
                    timeLimit,
                    attemptsAllowed,
                    passMark,
                    isPublished,
                }
            );

            toast.success("Quiz updated successfully");
        } catch (err) {
            toast.error("Failed to update quiz");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ================= ADD / UPDATE QUESTION =================
    const handleSaveQuestion = async () => {
        if (!question.trim()) {
            toast.error("Question is required");
            return;
        }

        if (options.some((o) => !o.trim())) {
            toast.error("All options are required");
            return;
        }

        try {
            // EDIT QUESTION
            if (editingQuestionId) {
                await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL
                    }/api/quiz/update-question/${editingQuestionId}`,
                    {
                        question,
                        explanation,
                        options,
                        correctAnswer: correct,
                    }
                );

                setQuestions((prev) =>
                    prev.map((q) =>
                        q._id === editingQuestionId
                            ? {
                                ...q,
                                questionText: question,
                                explanation,
                                options,
                                correctAnswer: correct,
                            }
                            : q
                    )
                );

                toast.success("Question updated");
            }
            // ADD QUESTION
            else {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/quiz/add-question`,
                    {
                        quizId,
                        question,
                        explanation,
                        options,
                        correctAnswer: correct,
                    }
                );

                setQuestions((prev) => [
                    ...prev,
                    {
                        _id: res.data.questionId,
                        questionText: question,
                        explanation,
                        options,
                        correctAnswer: correct,
                    },
                ]);

                toast.success("Question added");
            }

            resetQuestionForm();
        } catch (err) {
            toast.error("Failed to save question");
            console.error(err);
        }
    };

    // ================= EDIT QUESTION =================
    const handleEditQuestion = (q) => {
        setEditingQuestionId(q._id);
        setQuestion(q.questionText);
        setExplanation(q.explanation);
        setOptions(q.options);
        setCorrect(q.correctAnswer);
        setActiveTab("questions");
    };

    // ================= DELETE QUESTION =================
    const handleDeleteQuestion = async (id) => {
        if (!window.confirm("Delete this question?")) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/quiz/delete-question/${id}`
            );

            setQuestions((prev) => prev.filter((q) => q._id !== id));
            toast.success("Question deleted");
        } catch (err) {
            toast.error("Failed to delete question");
            console.error(err);
        }
    };

    const resetQuestionForm = () => {
        setQuestion("");
        setExplanation("");
        setOptions(["", "", "", ""]);
        setCorrect(0);
        setEditingQuestionId(null);
    };

    return (
        <div className="w-full overflow-y-scroll scrollbar-hide h-full bg-secondary p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold">Edit Quiz</h1>

            {/* Tabs */}
            <div className="flex my-6">
                {["details", "questions"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === tab
                            ? "text-purple-600 border-b-2 border-b-blue-500"
                            : "text-gray-500 hover:text-purple-500 border-b-white border-b-2"
                            }`}
                    >
                        {tab === "details" ? "Quiz Details" : "Questions"}
                    </button>
                ))}
            </div>

            {/* DETAILS TAB */}
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
                        onClick={handleUpdateQuiz}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : "Update Quiz"}
                    </button>
                </div>
            )}

            {/* QUESTIONS TAB */}
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
                        onClick={handleSaveQuestion}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-md"
                    >
                        {editingQuestionId ? "Update Question" : "Add Question"}
                    </button>

                    {questions.length > 0 && (
                        <div className="mt-6 space-y-2">
                            <h4 className="text-lg font-semibold text-gray-700">
                                Current Questions ({questions.length})
                            </h4>

                            {questions.map((q, i) => (
                                <div
                                    key={q._id || i}
                                    className="border-2 border-gray-200 rounded-lg p-3 flex justify-between items-center"
                                >
                                    <span className="font-medium text-gray-800">
                                        {i + 1}. {q.questionText}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditQuestion(q)}
                                            className="border-2 px-3 py-2 rounded-lg border-purple-200 hover:bg-purple-100 transition-colors"
                                        >
                                            <Pencil className="size-4 text-blue-600" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteQuestion(q._id)}
                                            className="border-2 px-3 py-2 rounded-lg border-red-200 hover:bg-red-100 transition-colors"
                                        >
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
