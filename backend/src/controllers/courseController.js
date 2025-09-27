import e from "express";
import Course from "../models/course.js";

export async function createCourse(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: "You are not authorized to perform this action, please login",
    });
  }

  if (req.user.role !== "instructor" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only instructors or admins can create courses",
    });
  }

  try {
    const course = new Course({
      ...req.body,
      instructor: req.user._id,
    });

    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(500).json({ message: "Error creating course" });
  }
}

export async function getAllCourses(req, res) {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course" });
  }
}

export async function deleteCourse(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message:
          "You are not authorized to perform this action, please login as admin or instructor",
      });
    }
    const deletedCourse = await Course.findOneAndDelete({ _id: req.body.id });
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course" });
  }
}

export async function getCourseByInstructor(req, res) {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
}
