import Course from "../models/course.js";
import User from "../models/user.js";

export const getStudentsByInstructor = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // 1️⃣ Get instructor's courses
    const courses = await Course.find({ instructor: instructorId }).select(
      "enrolledStudents"
    );

    if (!courses.length) {
      return res.status(200).json({
        success: true,
        total: 0,
        students: [],
      });
    }

    // 2️⃣ Collect unique student IDs
    const studentIds = new Set();

    courses.forEach((course) => {
      course.enrolledStudents.forEach((entry) => {
        if (entry.user) {
          studentIds.add(entry.user.toString());
        }
      });
    });

    const studentIdArray = Array.from(studentIds);

    if (!studentIdArray.length) {
      return res.status(200).json({
        success: true,
        total: 0,
        students: [],
      });
    }

    // 3️⃣ Fetch student details
    const students = await User.find({
      _id: { $in: studentIdArray },
      role: "student",
    }).select("-password");

    res.status(200).json({
      success: true,
      total: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students by instructor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getStudentOverviewByInstructor = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "instructor" && req.user.role !== "admin")
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const instructorId = req.user._id;
    const studentId = req.params.id;

    // 1️⃣ Get student
    const student = await User.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Get ONLY instructor's courses where student is enrolled
    const courses = await Course.find({
      instructor: instructorId,
      "enrolledStudents.user": studentId,
    }).select("title thumbnail price isPublished createdAt");

    res.status(200).json({
      student,
      courses,
    });
  } catch (error) {
    console.error("Student overview error:", error);
    res.status(500).json({ message: "Failed to load student overview" });
  }
};
