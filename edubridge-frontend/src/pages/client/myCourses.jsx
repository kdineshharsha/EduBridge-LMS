import React, { useState, useEffect } from "react";
import { Clock, BookOpen, User, PlayCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuth();

  const userId = user?._id;

  const fetchCourses = async () => {
    if (!userId) return; // Prevent API call if user not loaded yet
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course/enrolled-courses/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourses(response.data || []);
      console.log("Fetched Courses:", response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Loading your courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="bg-white w-full rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></span>
            My Enrolled Courses
          </h1>
          <span className="text-sm text-gray-500 font-medium">
            {courses.length} Courses
          </span>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            You haven’t enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-purple-200 flex flex-col h-full"
              >
                {/* Course Image */}
                <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden rounded-t-xl">
                  <img
                    src={course.thumbnail || "/placeholder.jpg"}
                    alt={course.title || "Course Thumbnail"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  <div className="absolute bottom-3 left-3 bg-indigo-900/90 backdrop-blur-sm px-3 py-1 rounded-md">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      📊
                      {course.instructor?.firstName +
                        " " +
                        course.instructor?.lastName || "Unknown Instructor"}
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-4 flex flex-col flex-grow space-y-3">
                  <h3 className="font-semibold text-gray-800 text-base line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>

                  {course.categories && course.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.categories.slice(0, 2).map((cat, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                        >
                          {cat}
                        </span>
                      ))}
                      {course.categories.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                          +{course.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-grow"></div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.totalDuration || "N/A"} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessonCount || 0} lessons
                    </span>
                  </div>

                  {/* Progress Section */}
                  <div className=" border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-semibold">
                        Progress
                      </span>
                      <span className="text-purple-600 font-bold">
                        {course.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button className="w-full text-center py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
