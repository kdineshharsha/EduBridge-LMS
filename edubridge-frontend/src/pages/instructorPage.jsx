import React, { useEffect, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { House, BookOpen, Users, Settings } from "lucide-react";
import InstructorDashboard from "./instructor/instructorDashboard";
import InstructorCourses from "./instructor/instructor_courses";
import AddCourse from "./instructor/addCourse";
import EditCourse from "./instructor/editCourse";
import toast from "react-hot-toast";
import axios from "axios";
import CourseOverview from "./instructor/couresOverview";
import AddCourse2 from "./instructor/addCourse copy";
import Students from "./instructor/students";
import StudentOverview from "./instructor/studentOverview";
import AddQuiz from "./instructor/addQuiz";
import EditQuiz from "./instructor/editQuiz";
import Dashboard from "./instructor/Dashboard/Dashboard";

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
          if (response.data.user.role === "instructor") {
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

  // async function checkInternet() {
  //   try {
  //     const response = await fetch("https://www.google.com/favicon.ico", {
  //       method: "HEAD",
  //       mode: "no-cors",
  //     });
  //     setOnline(true);
  //     console.log("Internet is available");
  //   } catch (error) {
  //     console.log("No internet access");
  //     setOnline(false);
  //   }
  // }

  const navItems = [
    { to: "/instructor/dashboard", label: "Dashboard", icon: House },
    { to: "/instructor/courses", label: "Courses", icon: BookOpen },
    { to: "/instructor/students", label: "Students", icon: Users },
    { to: "/instructor/settings", label: "Settings", icon: Settings },
  ];

  return userValidated ? (
    <div className="flex h-screen w-full bg-white poppins-regular">
      <div className="h-full w-72 hidden lg:block p-4  ">
        <div className="w-full flex justify-center">
          <img src="/logo.png" className="size-50" alt="" />
        </div>
        <nav className="space-y-2 ">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-xl  transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-lg shadow-blue-200/50  border-blue-200/50 "
                    : "text-gray-700 hover:bg-gray-100/80 hover:shadow-md hover:scale-105 "
                  }`
                }
              >
                <div className="p-2 rounded-lg bg-blue-500  text-white shadow-lg">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 flex flex-col h-full ">
        {/* Header */}
        <div className="bg-white sticky top-0 z-100 w-full flex items-center justify-between p-4">
          <div className="">
            <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome Back, Instructor</p>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<InstructorCourses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentOverview />} />
            <Route path="courses/:id" element={<CourseOverview />} />
            <Route path="courses/add-course" element={<AddCourse />} />
            {/* <Route path="courses/add-course" element={<AddCourse2 />} /> */}
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
