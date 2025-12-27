import Quiz from "../models/quiz.js";
import Lesson from "../models/lesson.js";
import QuizQuestion from "../models/quizQuestion.js";
import QuizAttempt from "../models/quizAttempt.js";

export async function createQuiz(req, res) {
  try {
    const {
      lessonId,
      title,
      description,
      timeLimit,
      attemptsAllowed,
      passMark,
    } = req.body;

    // Validate required fields
    if (!lessonId || !title) {
      return res.status(400).json({
        message: "Lesson ID and title are required",
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    // Create quiz
    const quiz = await Quiz.create({
      lesson: lessonId,
      title,
      description,
      timeLimit,
      attemptsAllowed,
      passMark,
    });

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz,
      quizId: quiz._id,
    });
  } catch (error) {
    console.log("Create Quiz Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function addQuestion(req, res) {
  try {
    const { quizId, questionText, options, correctAnswer, explanation } =
      req.body;

    if (!quizId || !questionText || !options || correctAnswer === undefined) {
      return res.status(400).json({
        message: "Quiz ID, question, options, and correct answer are required",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: "Options must be an array with at least 2 items",
      });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const question = await QuizQuestion.create({
      quiz: quizId,
      questionText,
      options,
      correctAnswer,
      explanation,
    });

    quiz.questions.push(question._id);
    await quiz.save();

    return res.status(201).json({
      message: "Question added successfully",
      question,
    });
  } catch (error) {
    console.log("Add Question Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getQuizById(req, res) {
  try {
    const quizId = req.params.id;
    console.log("Fetching quiz with ID:", quizId);

    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      model: "quizQuestions",
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      quiz,
    });
  } catch (error) {
    console.log("Get Quiz Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getQuizByLesson(req, res) {
  try {
    const lessonId = req.params.id;

    if (!lessonId) {
      return res.status(400).json({
        message: "Lesson ID is required",
      });
    }

    const quiz = await Quiz.findOne({ lesson: lessonId }).populate({
      path: "questions",
      model: "quizQuestions",
    });

    if (!quiz) {
      return res.status(404).json({
        message: "No quiz found for this lesson",
      });
    }

    return res.status(200).json({
      quiz,
    });
  } catch (error) {
    console.log("Get Quiz by Lesson Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function submitQuiz(req, res) {
  try {
    const userId = req.user._id; // from authentication middleware
    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "quizId and answers array are required",
      });
    }

    // Fetch the quiz
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // Fetch all question details
    const questionIds = answers.map((a) => a.questionId);
    const submittedQuestions = await QuizQuestion.find({
      _id: { $in: questionIds },
    });

    let score = 0;
    let total = submittedQuestions.length;

    // Compare answers
    const detailedResults = submittedQuestions.map((q) => {
      const userAnswer = answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );

      const isCorrect = q.correctAnswer === userAnswer?.selectedAnswer;

      if (isCorrect) score++;

      return {
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    // Check pass/fail
    const percentage = (score / total) * 100;
    const isPassed = percentage >= quiz.passMark;

    // Find current attempt count
    const previousAttempts = await QuizAttempt.find({
      user: userId,
      quiz: quizId,
    });
    const attemptNumber = previousAttempts.length + 1;

    // Save attempt
    const attempt = await QuizAttempt.create({
      user: userId,
      quiz: quizId,
      answers,
      score,
      isPassed,
      attemptNumber,
      timeTaken,
    });

    // Final response
    return res.status(200).json({
      message: "Quiz submitted successfully",
      attemptId: attempt._id,
      score,
      total,
      percentage,
      isPassed,
      questions: detailedResults,
      timeTaken,
    });
  } catch (error) {
    console.log("Submit Quiz Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getQuizWithAttempts(req, res) {
  try {
    const quizId = req.params.id;
    console.log("Fetching quiz and attempts for ID:", quizId);
    const userId = req.user._id; // logged-in user

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    // 1️⃣ Get quiz details
    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      model: "quizQuestions",
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 2️⃣ Get user’s previous attempts
    const attempts = await QuizAttempt.find({
      user: userId,
      quiz: quizId,
    })
      .sort({ createdAt: -1 }) // latest first
      .select("score attemptNumber createdAt isPassed timeTaken"); // only needed fields

    // Format attempts for UI
    const formattedAttempts = attempts.map((a) => ({
      attemptNumber: a.attemptNumber,
      score: a.score,
      date: a.createdAt,
      isPassed: a.isPassed,
      timeTaken: a.timeTaken,
    }));

    const quizDisabled =
      quiz.attemptsAllowed > 0 &&
      formattedAttempts.length >= quiz.attemptsAllowed;
    console.log("quizDisabled:", quizDisabled);

    // 3️⃣ Return everything in one response
    return res.status(200).json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questionCount: quiz.questions.length,
        attemptsAllowed: quiz.attemptsAllowed,
        passMark: quiz.passMark,
        quizDisabled,
      },
      attempts: formattedAttempts,
    });
  } catch (error) {
    console.log("Get Quiz With Attempts Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
