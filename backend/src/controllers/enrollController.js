import Course from "../models/course.js";
import User from "../models/user.js";

export async function enrollAfterPayment(req, res) {
  try {
    const { courseId, userId } = req.body;

    if (!courseId || !userId) {
      return res.status(400).json({ message: "Missing data" });
    }

    // 🔒 ATOMIC ENROLLMENT
    const result = await Course.updateOne(
      {
        _id: courseId,
        "enrolledStudents.user": { $ne: userId },
      },
      {
        $push: {
          enrolledStudents: {
            user: userId,
            enrolledAt: new Date(),
          },
        },
      }
    );

    // If no document was modified → already enrolled
    if (result.modifiedCount === 0) {
      return res.json({ message: "Already enrolled" });
    }

    // Keep user doc in sync (safe even on retries)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    return res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enroll error:", error);
    return res.status(500).json({ message: "Enrollment failed" });
  }
}
