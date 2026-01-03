import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    categories: [
      {
        type: String,
        enum: [
          "Programming",
          "Design",
          "Business",
          "Language",
          "Other",
          "UI/UX",
          "Web Development",
          "Data Science",
          "Cybersecurity",
          "Cloud Computing",
        ],
        default: "Other",
      },
    ],

    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lessons",
      },
    ],
    enrolledStudents: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    ratingCount: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("courses", courseSchema);
export default Course;
