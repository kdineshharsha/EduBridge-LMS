import e from "express";
import Course from "../models/course.js";
import Lesson from "../models/lesson.js";
import User from "../models/user.js";

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
      .populate("lessons") // 👈 fetch all lessons related to this course
      .exec();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const userId = req.user?._id;
    const isEnrolled = course.enrolledStudents.some(
      (studentId) => studentId.toString() === userId?.toString()
    );
    const lessons = course.lessons.map((lesson) => {
      if (isEnrolled) {
        return {
          _id: lesson._id,
          title: lesson.title,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          documentsUrls: lesson.documentsUrls,
          duration: lesson.duration,
          order: lesson.order,
        };
      } else {
        return {
          _id: lesson._id,
          title: lesson.title,
          content: lesson.content,
          duration: lesson.duration,
          order: lesson.order,
        };
      }
    });

    res.json({
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
      lessons,
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ message: "Error fetching course" });
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
      (id) => id && id.equals(userId)
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push(userId);
    console.log(userId);
    await course.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: course._id },
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
