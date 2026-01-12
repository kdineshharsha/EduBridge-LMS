import React, { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { House, BookOpen, Users, Settings, LogOutIcon } from "lucide-react";
import AddCourse from "./instructor/addCourse";
import toast from "react-hot-toast";
import axios from "axios";
import CourseOverview from "./instructor/couresOverview";
import StudentOverview from "./instructor/studentOverview";
import AddQuiz from "./instructor/addQuiz";
import EditQuiz from "./instructor/editQuiz";
import InstructorSettings from "./instructor/instructorSettings";
import AdminDashboard from "./admin/Dashboard/dashboard";
import AdminCourses from "./admin/adminCourses";
import EditCourse from "./admin/manageCourse";
import AdminUsers from "./admin/users";
import AdminUserOverview from "./admin/adminUserOverview";
import AdminSettings from "./admin/adminSettings";

export default function InstructorPage() {
  const [userValidated, setUserValidated] = useState(false);
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // checkInternet();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.user.role === "admin") {
            setUserValidated(true);
            console.log(response.data.user);
            setUser(response.data.user);
          } else {
            toast.error("Unauthorized ");
            navigate("/login");
          }
        })
        .catch((error) => {
          toast.error("Error validating user");
          console.error("Error validating user:", error);
          navigate("/login");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };


  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: House },
    { to: "/admin/courses", label: "Courses", icon: BookOpen },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return userValidated ? (
    <div className="flex h-screen w-full bg-white poppins-regular">
      <div className="h-full w-72 hidden lg:flex flex-col p-4">
        <div className="w-full flex justify-center">
          <img src="/logo.png" className="size-50" alt="" />
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-lg shadow-blue-200/50"
                    : "text-gray-700 hover:bg-gray-100/80 hover:shadow-md hover:scale-105"
                  }`
                }
              >
                <div className="p-2 rounded-lg bg-blue-500 text-white shadow-lg">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-4 px-4 py-3 rounded-xl
             text-red-600 hover:bg-red-50 transition-all duration-200
             hover:shadow-md group"
        >
          <div className="p-2 rounded-lg bg-red-500 text-white shadow-lg group-hover:scale-105 transition">
            <LogOutIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Logout</span>
        </button>



      </div>
      <div className="flex-1 flex flex-col h-full ">
        {/* Header */}
        <div className="bg-white sticky top-0 z-100 w-full flex items-center justify-between p-4">
          <div className="">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome Back, Admin</p>
          </div>
          {/* Profile Section */}

          <div className="flex space-x-4 items-center">
            <div className="relative">
              {/* Avatar */}
              <div className="size-10 bg-blue-500 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold text-sm">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName?.charAt(0).toUpperCase()}
                  </>
                )}
              </div>

              {/* Status Dot */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online ? "bg-green-500" : "bg-red-500"
                  }`}
              ></span>
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-sm font-medium">
                {user.firstName + " " + user.lastName}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
        {/* Main Content with routes */}
        <div className="h-full w-full bg-gray-200 md:p-6 rounded-lg">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/users/:id" element={<AdminUserOverview />} />
            <Route path="courses/:id" element={<CourseOverview />} />
            <Route path="courses/add-course" element={<AddCourse />} />
            <Route path="courses/edit-course/:id" element={<EditCourse />} />
            <Route path="courses/add-quiz/:id" element={<AddQuiz />} />
            <Route path="courses/edit-quiz/:id" element={<EditQuiz />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-gray-700 text-center">
          Validating Instructor access...
        </p>
      </div>
    </div>
  );
}
