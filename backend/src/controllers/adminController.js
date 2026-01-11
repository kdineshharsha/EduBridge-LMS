import User from "../models/user.js";
import Course from "../models/course.js";
import Lesson from "../models/lesson.js";
import Quiz from "../models/quiz.js";
import mongoose from "mongoose";

export async function getAdminCourseDetails(req, res) {
  try {
    // 🔐 Admin-only guard (optional but recommended)
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // 1️⃣ Fetch course + instructor
    const course = await Course.findById(courseId)
      .populate("instructor", "firstName lastName email")
      .lean();

    console.log("Fetched course:", course);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ Fetch lessons for this course
    const lessons = await Lesson.find({ course: courseId })
      .sort({ order: 1 })
      .lean();

    // 3️⃣ Attach quizzes per lesson
    const lessonsWithQuizzes = await Promise.all(
      lessons.map(async (lesson) => {
        const quiz = await Quiz.findOne({ lesson: lesson._id })
          .select(
            "title attemptsAllowed passPercentage totalQuestions createdAt"
          )
          .lean();

        return {
          _id: lesson._id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          videoUrl: lesson.videoUrl,
          documentsUrls: lesson.documentsUrls,
          quiz: quiz
            ? {
                _id: quiz._id,
                title: quiz.title,
                attemptsAllowed: quiz.attemptsAllowed,
                passPercentage: quiz.passPercentage,
                totalQuestions: quiz.totalQuestions,
                createdAt: quiz.createdAt,
              }
            : null,
        };
      })
    );

    // 4️⃣ Final response
    res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      rating: course.ratingAverage,
      ratingCount: course.ratingCount,
      price: course.price,
      isFree: course.isFree,
      isPublished: course.isPublished,
      isSuspended: course.isSuspended,
      categories: course.categories,
      thumbnail: course.thumbnail,
      createdAt: course.createdAt,
      enrolledCount: course.enrolledStudents?.length || 0,
      instructor: course.instructor,
      adminNote: course.adminNote || "",
      lessons: lessonsWithQuizzes,
    });
  } catch (error) {
    console.error("Admin course details error:", error);
    res.status(500).json({
      message: "Failed to load course details",
    });
  }
}

export const getAllUsersForAdmin = async (req, res) => {
  try {
    // 🔐 Admin guard
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // 📊 Count users by role
    const [totalStudents, totalInstructors, totalUsers] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      User.countDocuments({ role: { $ne: "admin" } }),
    ]);

    // 📋 Fetch all non-admin users
    const users = await User.find({ role: { $ne: "admin" } }, { password: 0 })
      .sort({ createdAt: -1 })
      .lean();

    // 🧠 Shape for frontend
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isDisabled: user.isDisabled,
      enrolledCoursesCount: user.enrolledCourses?.length || 0,
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      success: true,

      // 🔢 Stats (for cards)
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
      },

      // 📦 Table data
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

export const getUserOverview = async (req, res) => {
  try {
    // 🔒 Admin-only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // =========================
    // 1️⃣ FETCH USER
    // =========================
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let courses = [];

    // =========================
    // 2️⃣ STUDENT → ENROLLED COURSES
    // =========================
    if (user.role === "student") {
      courses = await Course.find({
        "enrolledStudents.user": user._id,
      })
        .select("title thumbnail price isFree isPublished")
        .lean();
    }

    // =========================
    // 3️⃣ INSTRUCTOR → CREATED COURSES
    // =========================
    if (user.role === "instructor") {
      const rawCourses = await Course.find({
        instructor: user._id,
      })
        .select(
          "title thumbnail price isFree isPublished enrolledStudents createdAt"
        )
        .lean();

      courses = rawCourses.map((course) => ({
        ...course,
        enrolledCount: course.enrolledStudents?.length || 0,
      }));
    }

    // =========================
    // 4️⃣ RESPONSE
    // =========================
    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isDisabled: user.isDisabled,
        createdAt: user.createdAt,
      },
      role: user.role,
      courses,
    });
  } catch (error) {
    console.error("User overview error:", error);
    res.status(500).json({
      message: "Failed to load user overview",
    });
  }
};
