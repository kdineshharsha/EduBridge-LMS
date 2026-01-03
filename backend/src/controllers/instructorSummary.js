import Course from "../models/course.js";
import Review from "../models/review.js";
import mongoose from "mongoose";

export const instructorSummary = async (req, res) => {
  try {
    const instructorId = req.user._id;

    /* ==============================
       FETCH INSTRUCTOR COURSES
    ============================== */
    const courses = await Course.find({ instructor: instructorId }).lean();
    const courseIds = courses.map((c) => c._id);

    /* ==============================
       ACTIVE COURSES
    ============================== */
    const activeCourses = courses.length;

    /* ==============================
       TOTAL STUDENTS
    ============================== */
    const totalStudents = courses.reduce(
      (sum, course) => sum + course.enrolledStudents.length,
      0
    );

    /* ==============================
       TOTAL REVENUE
    ============================== */
    const totalRevenue = courses.reduce((sum, course) => {
      if (course.isFree) return sum;
      return sum + course.price * course.enrolledStudents.length;
    }, 0);

    /* ==============================
       AVERAGE RATING
    ============================== */
    const ratingAgg = await Review.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const avgRating = ratingAgg.length
      ? Number(ratingAgg[0].avgRating.toFixed(1))
      : 0;

    /* ==============================
       RESPONSE (SUMMARY ONLY)
    ============================== */
    res.json({
      stats: {
        totalRevenue,
        totalStudents,
        activeCourses,
        avgRating,
      },
    });
  } catch (error) {
    console.error("Instructor Summary Error:", error);
    res.status(500).json({
      message: "Failed to load instructor summary",
    });
  }
};

export async function instructorRevenueChart(req, res) {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Course.aggregate([
      {
        $match: {
          instructor: instructorId,
          price: { $gt: 0 },
        },
      },
      { $unwind: "$enrolledStudents" },
      {
        $group: {
          _id: {
            year: { $year: "$enrolledStudents.enrolledAt" },
            month: { $month: "$enrolledStudents.enrolledAt" },
          },
          revenue: { $sum: "$price" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(
      data.map((d) => ({
        month: `${d._id.year}-${String(d._id.month).padStart(2, "0")}`,
        revenue: d.revenue,
      }))
    );
  } catch (err) {
    console.error("Revenue chart error:", err);
    res.status(500).json({ message: "Revenue chart failed" });
  }
}

export async function getDailyRevenue(req, res) {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.user._id);

    const revenue = await Course.aggregate([
      // 1️⃣ Only instructor's PAID courses
      {
        $match: {
          instructor: instructorId,
          price: { $gt: 0 },
        },
      },

      // 2️⃣ Break enrolledStudents array
      {
        $unwind: "$enrolledStudents",
      },

      // 3️⃣ Ensure enrolledAt exists
      {
        $match: {
          "enrolledStudents.enrolledAt": { $ne: null },
        },
      },

      // 4️⃣ Group by DAY
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

      // 5️⃣ Shape response for frontend
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
        },
      },

      // 6️⃣ Sort by date
      {
        $sort: { date: 1 },
      },
    ]);

    res.json(revenue);
  } catch (err) {
    console.error("Daily revenue error:", err);
    res.status(500).json({ message: "Failed to load daily revenue" });
  }
}
