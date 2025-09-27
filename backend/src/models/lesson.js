import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    order: {
      type: Number, // lesson sequence in course
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("lessons", lessonSchema);
export default Lesson;
