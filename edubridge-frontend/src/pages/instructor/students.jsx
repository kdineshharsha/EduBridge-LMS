import { BookOpen, Plus, User, Users, Users2 } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaSearch,
  FaDownload,
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
export default function Students() {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const limit = 10;
  const downloadRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(false);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/instructor/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStudents(res.data.students);
        setAllStudents(res.data.students);
        setTotalPages(Math.ceil(res.data.students.length / limit));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const toggleDisable = async (studentId, currentStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/disable/${studentId}`,
        { isDisabled: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, isDisabled: !currentStatus } : s
        )
      );
      setAllStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, isDisabled: !currentStatus } : s
        )
      );
    } catch (error) {
      console.error("Error disabling student", error);
    }
  };

  const filteredStudents = search
    ? allStudents.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      )
    : allStudents;

  const paginatedStudents = filteredStudents.slice(
    (page - 1) * limit,
    page * limit
  );

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Status", "Courses"];
    const rows = allStudents.map((s) => [
      s.firstName,
      s.lastName,
      s.email,
      s.isDisabled ? "Disabled" : "Active",
      s.enrolledCourses?.length || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    downloadRef.current.href = encodedUri;
    downloadRef.current.download = "student_list.csv";
    downloadRef.current.click();
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white rounded-lg  scrollbar-hide">
      <div className="h-full w-full overflow-y-auto bg-white rounded-lg  scrollbar-hide">
        {/* ⭐ KEEPING YOUR ORIGINAL HEADER SECTION EXACTLY SAME */}
        {/* Header Section */}
        <div className="mb-8 px-6 pt-6">
          <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Students Management
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage and organize your students
                </p>
              </div>
            </div>
            {/* <Link
              to="add-course/"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-xl text-white hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-200 font-semibold text-sm shadow-md hover:scale-105 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add New Course
            </Link> */}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 ">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FaDownload className="text-sm" />
                Export CSV
              </button>
              <a ref={downloadRef} style={{ display: "none" }} />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white   overflow-hidden">
          {loaded ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Total Students</p>
                      <p className="text-2xl font-bold">{allStudents.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaUserCheck className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Active Students</p>
                      <p className="text-2xl font-bold">
                        {allStudents.filter((s) => !s.isDisabled).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaUserTimes className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Disabled Students</p>
                      <p className="text-2xl font-bold">
                        {allStudents.filter((s) => s.isDisabled).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Enrolled Courses</p>
                      <p className="text-2xl font-bold">
                        {allStudents.reduce(
                          (a, s) => a + (s.enrolledCourses?.length || 0),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-purple-500" />
                          Student
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {student.firstName?.charAt(0)?.toUpperCase() ||
                                "S"}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {student._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              student.isDisabled
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {student.isDisabled ? (
                              <FaUserTimes />
                            ) : (
                              <FaUserCheck />
                            )}
                            {student.isDisabled ? "Disabled" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                toggleDisable(student._id, student.isDisabled)
                              }
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm ${
                                student.isDisabled
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-red-500 hover:bg-red-600 text-white"
                              }`}
                            >
                              {student.isDisabled ? (
                                <FaUserCheck />
                              ) : (
                                <FaUserTimes />
                              )}
                              {student.isDisabled ? "Enable" : "Disable"}
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/instructor/students/${student._id}`);
                              }}
                              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <FaEye />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, filteredStudents.length)} of{" "}
                    {filteredStudents.length} students
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <FaChevronLeft />
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages).keys()].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum + 1)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            page === pageNum + 1
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Next
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-100 w-full  flex items-center justify-center">
              <div className="text-gray-500">
                <Loader />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
