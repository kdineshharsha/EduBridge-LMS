import { User, BookOpen } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";

export default function StudentOverview() {
  const studentId = useParams().id;
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/instructor/students/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setStudent(res.data.student);
        console.log(res.data);
        setCourses(res.data.courses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studentId]);

  if (loading) return <Loader />;

  return (
    <div className="h-full w-full overflow-y-auto bg-white rounded-lg scrollbar-hide">
      {/* Header (UNCHANGED) */}
      <div className="mb-8 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Overview
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage and organize your students
            </p>
          </div>
        </div>
      </div>

      {/* User Details Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 m-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">User Details</h2>
        </div>

        <div className="flex w-full justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Full Name
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {student.firstName} {student.lastName}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Email
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {student.email}
            </p>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide ">
              Role
            </p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full uppercase">
              {student.role}
            </span>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Status
            </p>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                student.isDisabled
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {student.isDisabled ? "Disabled" : "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Enrolled Courses (Instructor Only) */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 m-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Enrolled Courses</h2>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No courses found</p>
            <p className="text-gray-400 text-sm mt-1">
              This student is not enrolled in any of your courses yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shadow-sm">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      course.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">
                  {course.title}
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                  Enrolled in this course
                </p>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="text-purple-600 font-semibold">
                      {course.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
