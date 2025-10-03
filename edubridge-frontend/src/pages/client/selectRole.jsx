import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
export default function SelectRole() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state;
  const access_token = location.state.accessToken;

  async function handleRegister(role) {
    try {
      let response;

      if (access_token) {
        // Google registration
        response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/user/google",
          { accessToken: access_token, role }
        );
      } else {
        // Normal registration
        response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/user/register",
          { ...userData, role }
        );
      }

      toast.success("Registration successful");
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black to-purple-800 p-6">
      <div className="flex flex-col items-center bg-gray-900/60 p-10 w-[90%] lg:w-[60%] backdrop-blur-2xl rounded-2xl border border-gray-700 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Select Your Role</h2>
        <p className="text-gray-300 mb-10 text-center max-w-md">
          Choose how you want to use the LMS. Instructors can create and manage
          courses, while students can join classes and track their learning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div
            onClick={() => {
              handleRegister("instructor");
            }}
            className="cursor-pointer group bg-gray-800/70 hover:bg-purple-700 transition-all duration-300 p-8 rounded-xl border border-gray-700 flex flex-col items-center text-center"
          >
            <FaChalkboardTeacher className="text-5xl text-purple-400 group-hover:text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Instructor
            </h3>
            <p className="text-gray-300 text-sm">
              Create and manage courses, assignments, quizzes, and track student
              progress.
            </p>
          </div>

          <div
            onClick={() => {
              handleRegister("student");
            }}
            className="cursor-pointer group bg-gray-800/70 hover:bg-purple-700 transition-all duration-300 p-8 rounded-xl border border-gray-700 flex flex-col items-center text-center"
          >
            <FaUserGraduate className="text-5xl text-purple-400 group-hover:text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Student</h3>
            <p className="text-gray-300 text-sm">
              Access courses, complete assignments, take quizzes, and track your
              learning journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
