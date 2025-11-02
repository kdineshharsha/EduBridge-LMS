import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Star, Users, PlayCircle, BookOpen, Clock } from "lucide-react";
import CourseLessons from "../../components/accordian";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { FcApproval } from "react-icons/fc";
import Testing from "../testing";

export default function Overview() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!params.id) window.location.href = "/courses";

    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/course/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourse(response.data);
        console.log(response.data);
        setLessons(response.data.lessons || []);
        setIsEnrolled(response.data.isEnrolled);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching course:", error);
        setIsLoaded(true);
      }
    };

    fetchCourse();
  }, [params.id, isLoaded]);

  const handleEnroll = async () => {
    try {
      console.log(token);
      if (!token) {
        toast.error("You must be logged in to enroll in a course.");
        navigate("/login");
        return;
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/course/enroll/${course._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success(response.data.message);
        setIsLoaded(false);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Error enrolling in course");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-gray-600 text-lg animate-pulse">
          Loading course...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-gray-500 text-lg">Course not found</div>
      </div>
    );
  }

  const totalDuration = lessons.reduce(
    (acc, lesson) => acc + (lesson.duration || 0),
    0
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-20">
      <div className="w-full mx-auto   space-y-12">
        {/* 🧠 Course Info Section */}
        <div
          className="relative p-4 md:px-16 md:py-12 bg-cover bg-center"
          style={{
            backgroundImage: `url(${course.thumbnail})`,
          }}
        >
          {/*  Glassy blur overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>

          {/*  Foreground content */}
          <div className="relative bg-white rounded-3xl shadow-lg p-8 border border-white/40 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
            {/* Left: Details */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {course.title || "Untitled Course"}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                {course.description ||
                  "No description provided for this course yet."}
              </p>
              <p className="text-gray-700 font-semibold text-lg leading-relaxed">
                Created by
                <span className=" ml-2 text-blue-500">
                  {course.instructor.firstName +
                    " " +
                    course.instructor.lastName ||
                    "No description provided for this course yet."}
                </span>
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <p className="font-semibold">
                    {course.ratingAverage.toFixed(1) || 0}
                  </p>
                  <span className="text-sm text-gray-600">course rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold">{lessons.length}</p>
                  <span className="text-sm text-gray-600">lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold">{totalDuration}</p>
                  <span className="text-sm text-gray-600">minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <p className="font-semibold">
                    {course.enrolledStudents || 0}
                  </p>
                  <span className="text-sm text-gray-600">
                    students enrolled
                  </span>
                </div>
              </div>

              {/* Button + Price */}
              <div className="flex items-center gap-6 mt-6">
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                  className={`px-6 py-3 font-semibold rounded-xl transition-all flex items-center gap-2 ${
                    isEnrolled
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <FcApproval className="text-xl" />
                      Already Enrolled
                    </>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{course.price?.toLocaleString() || "0.00"}
                </p>
              </div>
            </div>

            {/* Right: Thumbnail or Instructor Image */}
            {course.thumbnail && (
              <div className="w-full md:w-[480px] rounded-2xl overflow-hidden shadow-lg border border-white/40">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-[300px] object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Course Lessons Accordion */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 md:mx-16 mx-4">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Course Content
            </h2>
          </div>

          {lessons.length > 0 ? (
            <CourseLessons lessons={lessons} thumbnail={course.thumbnail} />
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No lessons available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
