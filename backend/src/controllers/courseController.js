import e from "express";
import Course from "../models/course.js";
import Lesson from "../models/lesson.js";
import User from "../models/user.js";
import Quiz from "../models/quiz.js";
import QuizAttempt from "../models/quizAttempt.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export async function createCourse(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: "You are not authorized to perform this action, please login",
    });
  }

  if (req.user.role !== "instructor" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only instructors or admins can create courses",
    });
  }

  try {
    const course = new Course({
      ...req.body,
      instructor: req.user._id,
    });

    await course.save({ new: true });
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(500).json({ message: "Error creating course" });
  }
}

export async function getAllCourses(req, res) {
  try {
    const courses = await Course.find()
      .populate("instructor", "firstName lastName")
      .exec();

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "firstName lastName email")
      .populate("lessons")
      .exec();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const userId = req.user?._id;

    const isEnrolled = course.enrolledStudents.some(
      (item) => item.user.toString() === userId.toString()
    );

    // 🔥 Build lessons with quiz data
    const lessons = await Promise.all(
      course.lessons.map(async (lesson) => {
        const quiz = await Quiz.findOne({ lesson: lesson._id });

        let attemptCount = 0;
        let lastAttemptStatus = "not_attempted";
        let remainingAttempts = quiz ? quiz.attemptsAllowed : null;

        if (quiz && userId) {
          const attempts = await QuizAttempt.find({
            user: userId,
            quiz: quiz._id,
          })
            .sort({ createdAt: -1 })
            .lean();

          attemptCount = attempts.length;

          if (attemptCount > 0) {
            lastAttemptStatus = attempts[0].isPassed ? "passed" : "failed";
          }

          // Calculate remaining attempts (only if limited)
          if (quiz.attemptsAllowed !== null) {
            remainingAttempts = quiz.attemptsAllowed - attemptCount;
            if (remainingAttempts < 0) remainingAttempts = 0;
          }
        }

        return {
          _id: lesson._id,
          title: lesson.title,
          content: isEnrolled ? lesson.content : undefined,
          videoUrl: isEnrolled ? lesson.videoUrl : undefined,
          documentsUrls: isEnrolled ? lesson.documentsUrls : undefined,
          duration: lesson.duration,
          order: lesson.order,
          enrolledStudents: course.enrolledStudents?.length,

          // quiz fields
          hasQuiz: !!quiz,
          quizId: isEnrolled && quiz ? quiz._id : undefined,
          attemptsAllowed:
            isEnrolled && quiz ? quiz.attemptsAllowed : undefined,
          attemptCount: isEnrolled ? attemptCount : undefined,
          remainingAttempts: isEnrolled ? remainingAttempts : undefined,
          lastAttemptStatus: isEnrolled ? lastAttemptStatus : undefined,
        };
      })
    );

    return res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      enrolledStudents: course.enrolledStudents?.length,
      ratingAverage: course.ratingAverage,
      ratingCount: course.ratingCount,
      isEnrolled,
      categories: course.categories,
      isPublished: course.isPublished,
      isFree: course.isFree,
      lessons,
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({ message: "Error fetching course" });
  }
}

export async function deleteCourse(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message:
          "You are not authorized to perform this action, please login as admin or instructor",
      });
    }

    const courseId = req.params.id;
    console.log(courseId);

    // Delete the course
    const deletedCourse = await Course.findOneAndDelete({ _id: courseId });
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete related lessons
    await Lesson.deleteMany({ courseId });

    res.json({ message: "Course and related lessons deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course and lessons" });
  }
}

export async function getCourseByInstructor(req, res) {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
}

export async function updateCourse(req, res) {
  try {
    if (
      !req.user ||
      (req.user.role !== "instructor" && req.user.role !== "admin")
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to perform this action. Please log in as an instructor or admin.",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating course" });
  }
}

export async function enrollStudent(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Please login first" });
    }

    const userId = req.user._id;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const alreadyEnrolled = course.enrolledStudents.some(
      (item) => item.user.toString() === userId.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push({
      user: userId,
      enrolledAt: new Date(),
    });
    console.log(userId);
    await course.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: course._id },
    });

    const message = {
      from: process.env.EMAIL,
      to: req.user.email,
      subject: "Enrollment Confirmation",
      html: `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background: #f5f7fa;
    padding: 40px 0;
    color: #333;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    ">
      
      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #4f46e5, #9333ea);
        padding: 24px;
        text-align: center;
        color: white;
      ">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.5px;">
          🎉 You're Enrolled!
        </h1>
      </div>

      <!-- Thumbnail -->
      <div style="width: 100%; overflow: hidden; max-height: 260px;">
        <img 
          src="${course.thumbnail}" 
          alt="Course Thumbnail" 
          style="
            width: 100%;
            display: block;
            object-fit: cover;
            border-bottom: 1px solid #eee;
          "
        />
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <h2 style="
          margin-top: 0;
          font-size: 24px;
          color: #111;
          font-weight: 700;
        ">
          Welcome to <span style="color:#4f46e5">${course.title}</span>
        </h2>

        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          You’re now officially enrolled, sweetheart 💙  
          Start learning and unlock your next step toward success.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="http://localhost:5173/courses/${course._id}" 
            style="
              display: inline-block;
              background: linear-gradient(135deg, #4f46e5, #9333ea);
              padding: 14px 30px;
              border-radius: 10px;
              color: white;
              text-decoration: none;
              font-size: 16px;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(79,70,229,0.3);
            ">
            Start Learning →
          </a>
        </div>

        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          If the button doesn’t work, copy this link:
          <br><br>
          <span style="color:#4f46e5; word-break: break-all;">
            http://localhost:5173/courses/${course._id}
          </span>
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background: #f3f4f6; 
        text-align: center; 
        padding: 16px;
        font-size: 13px; 
        color: #777;
      ">
        © 2025 Edu-Bridge. All rights reserved.
      </div>

    </div>
  </div>
`,
    };

    await transport.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error sending enrollment confirmation email",
        });
      } else {
        return res.status(200).json({
          message: "Enrollment confirmation email sent successfully",
        });
      }
    });

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Error enrolling student" });
  }
}

export async function getCoursesbyStudentId(req, res) {
  try {
    const studentId = req.params.id;

    // Step 1: Find user and populate enrolledCourses
    const user = await User.findById(studentId).populate({
      path: "enrolledCourses",
      select: "title thumbnail categories lessons instructor", // only needed fields
      populate: {
        path: "instructor",
        select: "firstName lastName", // only instructor name
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Map course data with lesson count and total duration
    const formattedCourses = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        // Populate lessons separately if needed
        const populatedCourse = await Course.findById(course._id).populate({
          path: "lessons",
          select: "duration", // only lesson duration
        });

        const totalDuration = populatedCourse.lessons.reduce(
          (sum, lesson) => sum + (lesson.duration || 0),
          0
        );

        return {
          _id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          categories: course.categories,
          instructor: course.instructor,
          lessonCount: populatedCourse.lessons.length,
          totalDuration,
        };
      })
    );

    return res.status(200).json(formattedCourses);
  } catch (error) {
    console.error("Error fetching enrolled course details:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getCoursesByFilter(req, res) {
  try {
    const { type, category } = req.query;

    let filter = { isPublished: true };

    if (type === "featured") {
      filter.isFeatured = true;
    } else if (type === "free") {
      filter.isFree = true;
    } else if (category) {
      filter.categories = category;
    }

    const courses = await Course.find(filter)
      .populate("instructor", "firstName lastName")
      .exec();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching filtered courses:", error);
    res.status(500).json({ message: "Server error" });
  }
}
