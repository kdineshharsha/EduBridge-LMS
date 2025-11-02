import Review from "../models/review.js";
import Course from "../models/course.js";
export async function createReview(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { courseId, rating, comment } = req.body;
    const userId = req.user._id;

    const existingReview = await Review.findOne({ userId, courseId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }
    const newReview = new Review({
      userId,
      courseId,
      rating,
      comment,
    });

    await newReview.save();

    const reviews = await Review.find({ courseId });
    const ratingCount = reviews.length;
    const ratingAverage =
      reviews.reduce((total, review) => total + review.rating, 0) / ratingCount;

    await Course.findByIdAndUpdate(courseId, {
      ratingAverage: ratingAverage.toFixed(1),
      ratingCount,
    });
    return res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Error creating review" });
  }
}

export async function getReviewsByCourseId(req, res) {
  try {
    const courseId = req.params.id;
    console.log(courseId);
    const reviews = await Review.find({ courseId })
      .populate("userId", "firstName lastName")
      .exec();

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error fetching reviews" });
  }
}

export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find()
      .populate("userId", "firstName lastName")
      .populate("courseId", "title")
      .exec();

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error fetching reviews" });
  }
}

export async function editReviewById(req, res) {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this review" });
    }

    if (rating !== undefined) {
      review.rating = rating;
    }
    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    const course = await Course.findById(review.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({ courseId: course._id });
    const ratingCount = reviews.length;
    const ratingAverage =
      ratingCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

    course.ratingCount = ratingCount;
    course.ratingAverage = ratingAverage.toFixed(1);

    await course.save();

    return res.status(200).json({
      message: "Review updated successfully",
      review,
      course: {
        ratingAverage: course.ratingAverage,
        ratingCount: course.ratingCount,
      },
    });
  } catch (error) {
    console.error("Error editing review:", error);
    return res.status(500).json({ message: "Error editing review" });
  }
}

export async function deleteReviewById(req, res) {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const instructor = await Course.findById(review.courseId).select(
      "instructor"
    );
    const instructorId = instructor.instructor.toString();

    console.log("instructorId", instructorId);
    console.log("userId", userId);

    if (review.userId !== userId && instructorId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this review" });
    }

    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return res.status(404).json({ message: "Review already deleted" });
    }
    const course = await Course.findById(review.courseId);

    const reviews = await Review.find({ courseId: course._id });
    const ratingCount = reviews.length;
    const ratingAverage =
      ratingCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

    course.ratingCount = ratingCount;
    course.ratingAverage = ratingAverage.toFixed(1);

    await course.save();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Error deleting review" });
  }
}
