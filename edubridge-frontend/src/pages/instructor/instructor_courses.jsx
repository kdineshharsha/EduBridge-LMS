import React, { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2, BookOpen } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SlBadge } from "react-icons/sl";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/current`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  // Fetch instructor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/course/instructor/${userId}`
        );
        setCourses(response.data);
        console.log(response.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setIsLoaded(true);
      }
    };

    if (userId) {
      fetchCourses();
    }
  }, [userId, isLoaded]);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLoaded(false);
      console.log("Course deleted successfully!");
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course!");
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white rounded-lg md:p-6 py-6 px-2 scrollbar-hide">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage and organize your courses
              </p>
            </div>
          </div>
          <Link
            to="add-course/"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-xl text-white hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-200 font-semibold text-sm shadow-md hover:scale-105 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      {isLoaded && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {courses.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">Published</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {courses.filter((c) => c.isPublished).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">Drafts</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {courses.filter((c) => !c.isPublished).length}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!isLoaded ? (
        <div className="flex w-full h-full items-center justify-center ">
          <Loader />
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No courses found</p>
          <p className="text-gray-400 text-sm mt-2">
            Create your first course to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-purple-200 flex flex-col h-full"
            >
              {/* Course Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden rounded-t-xl">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <BookOpen className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {course.isPublished ? (
                    <span className="px-3 py-1 bg-green-500/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                      Published
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-500/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                      Draft
                    </span>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  {course.isFree ? (
                    <span className="px-3 py-1 flex items-center gap-x-2 bg-yellow-500 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                      <SlBadge className="w-4 h-4" />
                      Free
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-500/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm hidden">
                      Paid
                    </span>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {course.title}
                </h3>
                {/* Description */}
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {course.description}
                </p>

                {/* Categories */}
                {course.categories && course.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
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

                {/* Spacer to push price and actions to bottom */}
                <div className="flex-grow"></div>

                {/* Price */}
                <div className="mb-4 pb-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-gray-900 mt-4">
                    ₨{course.price.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex overflow-x-scroll scrollbar-hide gap-2">
                  <Link
                    to={`/instructor/courses/${course._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-200"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline ">View</span>
                  </Link>
                  <Link
                    to={`/instructor/courses/edit-course/${course._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm border border-purple-200"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
