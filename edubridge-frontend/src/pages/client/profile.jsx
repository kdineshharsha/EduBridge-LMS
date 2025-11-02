import React, { useEffect, useState } from "react";
import { Download, Clock, LogIn, LogOut, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FourSquare } from "react-loading-indicators";
import Loader from "../../components/loader";

export default function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/current`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userRes.data.user);
        console.log(userRes.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        <Loader />{" "}
      </div>
    );
  }

  // 🚫 No user data
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        No user data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="bg-white w-full rounded-3xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
            Student Details
          </h1>
        </div>

        {/* User Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-sm flex items-center justify-center text-white font-semibold text-4xl bg-blue-600">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {user.firstName?.charAt(0).toUpperCase()}
                {user.lastName?.charAt(0).toUpperCase()}
              </>
            )}
          </div>

          <div className="flex-1 space-y-2   text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-12 text-sm text-gray-700 mt-2">
              <div className="space-y-1">
                <p className="font-semibold">Role</p>
                <p className="capitalize">{user.role}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Phone</p>
                <p className=""> {user.phone || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Email</p>
                <p className="">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm border border-gray-200">
            <LogIn className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {user.enrolledCourses?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Total Enrolled Courses</p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm border border-gray-200">
            <Clock className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {user.avgCheckIn || "--:--"}
            </p>
            <p className="text-sm text-gray-600">Avg Check In Time</p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm border border-gray-200">
            <LogOut className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {user.avgCheckOut || "--:--"}
            </p>
            <p className="text-sm text-gray-600">Avg Check Out Time</p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm border border-gray-200">
            <Award className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-lg font-semibold text-gray-800">
              {user.predicate || "N/A"}
            </p>
            <p className="text-sm text-gray-600">Performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
