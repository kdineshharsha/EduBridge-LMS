import Course from "../models/course.js";
import User from "../models/user.js";

export async function enrollAfterPayment(req, res) {
  try {
    const { courseId, userId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.enrolledStudents.includes(userId)) {
      return res.json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({ message: "Enrollment failed" });
  }
}
