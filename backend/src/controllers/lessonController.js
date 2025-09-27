import Course from "../models/course.js";
import Lesson from "../models/lesson.js";

export async function createLesson(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message:
        "You are not authorized to perform this action, please login as a admin or instructor",
    });
  }
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    await Course.findByIdAndUpdate(req.body.course, {
      $push: { lessons: lesson._id },
    });
    res.status(201).json({ message: "Lesson created successfully", lesson });
  } catch (error) {
    console.error("Lesson creation error:", error);
    res.status(500).json({ message: "Error creating lesson" });
  }
}

export async function getAllLessons(req, res) {
  try {
    const { course } = req.query;

    // Optional filtering by course ID
    const query = course ? { course } : {};

    const lessons = await Lesson.find(query)
      .sort({ order: 1 }) // Sort by lesson sequence
      .populate("course", "title instructor"); // Include course title and instructor ID

    return res.status(200).json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Error fetching lessons" });
  }
}

export async function deleteLessonById(req, res) {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "instructor")
  ) {
    return res.status(403).json({
      message:
        "You are not authorized to perform this action, please login as an admin or instructor",
    });
  }

  try {
    const lessonId = req.params.id;

    // First, find the lesson to get its course ID
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(lessonId);

    // Remove the lesson reference from the course
    await Course.findByIdAndUpdate(lesson.course, {
      $pull: { lessons: lessonId },
    });

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ message: "Error deleting lesson" });
  }
}
