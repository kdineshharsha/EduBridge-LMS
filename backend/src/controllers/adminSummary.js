import Course from "../models/course.js";
import User from "../models/user.js";

export const adminSummary = async (req, res) => {
  try {
    /* ==============================
       TOTAL USERS
    ============================== */
    const totalUsers = await User.countDocuments({
      role: { $in: ["student", "instructor"] },
    });

    /* ==============================
       COURSES
    ============================== */
    const courses = await Course.find().lean();

    /* ==============================
       ACTIVE COURSES (PUBLISHED)
    ============================== */
    const activeCourses = courses.filter(
      (course) => course.isPublished === true
    ).length;

    /* ==============================
       TOTAL ENROLLMENTS
    ============================== */
    const totalEnrollments = courses.reduce(
      (sum, course) => sum + (course.enrolledStudents?.length || 0),
      0
    );

    /* ==============================
       TOTAL REVENUE
    ============================== */
    const totalRevenue = courses.reduce((sum, course) => {
      if (course.isFree || course.price === 0) return sum;
      return sum + course.price * (course.enrolledStudents?.length || 0);
    }, 0);

    /* ==============================
       RESPONSE
    ============================== */
    res.json({
      stats: {
        totalRevenue,
        totalUsers,
        totalEnrollments,
        activeCourses,
      },
    });
  } catch (error) {
    console.error("Admin Summary Error:", error);
    res.status(500).json({
      message: "Failed to load admin summary",
    });
  }
};

export const adminRevenueChart = async (req, res) => {
  try {
    const revenue = await Course.aggregate([
      // Only paid courses
      {
        $match: {
          price: { $gt: 0 },
        },
      },

      // Break enrolledStudents array
      {
        $unwind: "$enrolledStudents",
      },

      // Ensure date exists
      {
        $match: {
          "enrolledStudents.enrolledAt": { $ne: null },
        },
      },

      // Group by DAY
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$enrolledStudents.enrolledAt",
            },
          },
          revenue: { $sum: "$price" },
        },
      },

      // Format response
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
        },
      },

      // Sort by date
      {
        $sort: { date: 1 },
      },
    ]);

    res.json(revenue);
  } catch (error) {
    console.error("Admin revenue chart error:", error);
    res.status(500).json({ message: "Failed to load revenue chart" });
  }
};

export async function getUserRoleSummary(req, res) {
  try {
    // Optional: ensure admin access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [totalUsers, totalStudents, totalInstructors] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
    });
  } catch (error) {
    console.error("User role summary error:", error);
    res.status(500).json({
      message: "Failed to load user summary",
    });
  }
}
