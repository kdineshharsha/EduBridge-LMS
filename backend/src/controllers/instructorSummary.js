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

export async function getTopCourses(req, res) {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.user._id);

    const courses = await Course.aggregate([
      // 1️⃣ Match instructor correctly
      {
        $match: {
          instructor: instructorId,
        },
      },

      // 2️⃣ Project safe fields
      {
        $project: {
          title: 1,
          thumbnail: 1,

          category: {
            $ifNull: [{ $arrayElemAt: ["$categories", 0] }, "Other"],
          },

          students: {
            $size: { $ifNull: ["$enrolledStudents", []] },
          },

          sales: {
            $multiply: [
              { $size: { $ifNull: ["$enrolledStudents", []] } },
              { $ifNull: ["$price", 0] },
            ],
          },

          price: {
            $cond: [
              { $eq: ["$price", 0] },
              "Free",
              { $concat: ["Rs. ", { $toString: "$price" }] },
            ],
          },

          status: {
            $cond: [{ $eq: ["$isPublished", true] }, "Published", "Draft"],
          },
        },
      },

      // 3️⃣ Sort by revenue first, students second
      { $sort: { sales: -1, students: -1 } },

      // 4️⃣ Limit
      { $limit: 5 },
    ]);

    console.log("Top courses:", courses);
    res.json(courses);
  } catch (err) {
    console.error("Top courses error:", err);
    res.status(500).json({ message: "Failed to load top courses" });
  }
}

export async function getCourseHealth(req, res) {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.user._id);

    const result = await Course.aggregate([
      {
        $match: { instructor: instructorId },
      },
      {
        $group: {
          _id: "$isPublished",
          count: { $sum: 1 },
        },
      },
    ]);

    let publishedCourses = 0;
    let draftCourses = 0;

    for (const item of result) {
      if (item._id === true) publishedCourses = item.count;
      if (item._id === false) draftCourses = item.count;
    }

    res.json({
      publishedCourses,
      draftCourses,
      total: publishedCourses + draftCourses,
    });
  } catch (error) {
    console.error("Course health error:", error);
    res.status(500).json({ message: "Failed to load course health" });
  }
}

export async function getLatestFeedback(req, res) {
  try {
    const instructorId = req.user._id;

    const latestReview = await Review.findOne()
      .populate({
        path: "courseId",
        match: { instructor: instructorId },
        select: "title",
      })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    if (!latestReview || !latestReview.courseId) {
      return res.json(null);
    }

    res.json({
      student: `${latestReview.userId.firstName} ${latestReview.userId.lastName}`,
      course: latestReview.courseId.title,
      rating: latestReview.rating,
      comment: latestReview.comment,
      date: latestReview.createdAt,
    });
  } catch (error) {
    console.error("Latest feedback error:", error);
    res.status(500).json({ message: "Failed to load latest feedback" });
  }
}
