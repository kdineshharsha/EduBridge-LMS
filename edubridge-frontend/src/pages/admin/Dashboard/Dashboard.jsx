import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import Chart from 'react-apexcharts';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  MoreVertical,
  Star,
  Calendar,
  Filter,
  PieChart,
  CheckCircle
} from 'lucide-react';
import TopPerformingCourses from '../../../components/topPerformingCourses';
import LatestFeedback from '../../../components/latestFeedback';
import DonutSummaryChart from '../../../components/donutSummary';

const Dashhboard = () => {

  const [stats, setStats] = useState(null)
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [userSummary, setUserSummary] = useState(null);
  const [latestFeedback, setLatestFeedback] = useState(null);



  const token = localStorage.getItem("token");

  // Fetch Summary
  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(response.data.stats)
      } catch (error) {
        console.error("Error fetching instructor summary:", error);
      }
    }
    fetchSummary();
  }, [])

  // Fetch Revenue Data
  useEffect(() => {
    async function fetchRevenue() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/revenue-chart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(res.data.map((item) => item.date));
        setSeries([
          {
            name: "Revenue",
            data: res.data.map((item) => item.revenue),
          },
        ]);
      } catch (err) {
        console.error("Revenue chart error:", err);
      }
    }

    fetchRevenue();
  }, []);

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 900,          // main line draw speed
        animateGradually: {
          enabled: true,
          delay: 150,        // point-by-point entrance
        },
        dynamicAnimation: {
          enabled: true,
          speed: 700,        // when data updates
        },
      },
    },

    colors: ["#2563eb"],
    stroke: {
      curve: "smooth",
      width: 3,
      lineCap: "round",
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },

    markers: {
      size: 0,
      hover: {
        size: 6,
        sizeOffset: 3,
      },
    },

    dataLabels: { enabled: false },
    xaxis: {
      categories,
      tickAmount: 6,
      labels: {
        rotate: -45,
        style: {
          colors: "#6b7280",
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rs. ${val.toLocaleString()}`,
        style: { colors: "#6b7280" },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      style: {
        fontSize: "13px",
      },
      y: {
        formatter: (val) => `Rs. ${val.toLocaleString()}`,
      },
    },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 3,
    },
  };



  useEffect(() => {
    async function fetchTopCourses() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/top-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Top Courses:", res.data);
        setTopCourses(res.data);
      } catch (err) {
        console.error("Top courses fetch error:", err);
      }
    }

    fetchTopCourses();
  }, []);

  useEffect(() => {
    async function fetchCourseHealth() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/user-summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserSummary(res.data);
        console.log("User Summary:", res.data);
      } catch (err) {
        console.error("Failed to load course health", err);
      }
    }

    fetchCourseHealth();
  }, []);

  useEffect(() => {
    async function fetchLatestFeedback() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/instructor/latest-feedback`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLatestFeedback(res.data);
        console.log("Latest Feedback:", res.data);
      } catch (err) {
        console.error("Failed to load latest feedback", err);
      }
    }

    fetchLatestFeedback();
  }, []);






  // --- HELPER DATA FOR UI ---
  // Updated colors to Blue-600/Blue-100
  const statCards = stats ? [
    { title: "Total Revenue", value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-blue-600 text-white" },
    { title: "Active Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "bg-white text-blue-600 border border-blue-100" },
    { title: "Active Courses", value: stats.activeCourses, icon: BookOpen, color: "bg-white text-blue-600 border border-blue-100" },
    { title: "Total Enrollments", value: stats.totalEnrollments, icon: Star, color: "bg-white text-blue-600 border border-blue-100" },
  ] : [];



  const recentActivities = [
    { id: 1, user: "Alex Morgan", action: "enrolled in", target: "React Native Bootcamp", time: "2 min ago", icon: Users, color: "bg-blue-50 text-blue-600" },
    { id: 2, user: "Sarah L.", action: "completed", target: "Module 4: Flexbox", time: "15 min ago", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { id: 3, user: "System", action: "processed", target: "$450.00 Payout", time: "1 hour ago", icon: DollarSign, color: "bg-purple-50 text-purple-600" },
    { id: 4, user: "Mike Ross", action: "left a review", target: "Python Masterclass", time: "3 hours ago", icon: Star, color: "bg-amber-50 text-amber-600" }
  ];



  return (
    <div className="h-full overflow-scroll scrollbar-hide bg-white rounded-lg font-[Poppins] text-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Dashhboard Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Dashhboard Overview</h1>
                <p className="text-gray-600 text-sm mt-1">Welcome back, here’s what’s happening today</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"><Calendar className="w-4 h-4" /> Oct 15 - Nov 15</button>
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:scale-105 transition-all"><Filter className="w-5 h-5" /> Filter</button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!stats ? (
            <div className="col-span-4 text-center text-gray-400 py-10">Loading dashboard summary...</div>
          ) : (
            statCards.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">{stat.title}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- REVENUE CHART --- */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
                <p className="text-sm text-gray-500">
                  Recent order revenue performance
                </p>
              </div>
            </div>


            <Chart
              options={options}
              series={series}
              type="area"
              height={320}
            />

          </div>


          {/* Progress & Quick Stats */}
          <div className="flex flex-col gap-6">
            <DonutSummaryChart
              title="User Summary"
              labels={[
                `Students (${userSummary ? userSummary.totalStudents : 0})`,
                `Instructors (${userSummary ? userSummary.totalInstructors : 0})`,
              ]}
              values={[
                userSummary ? userSummary.totalStudents : 0,
                userSummary ? userSummary.totalInstructors : 0,
              ]}
              totalLabel="Total Users"
            />



            <LatestFeedback feedback={latestFeedback} />
          </div>

        </div>

        {/* Bottom Section: Recent Activity + Table */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-400">Latest student actions</p>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div className="space-y-6 flex-1">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 relative items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color} shadow-sm`}><activity.icon className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 leading-none">{activity.user} <span className="text-gray-500 font-normal">{activity.action}</span></p>
                    <p className="text-sm font-bold text-gray-800 truncate mt-1">{activity.target}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">View Full History</button>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Top Performing Courses</h2>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</a>
            </div>
            <TopPerformingCourses courses={topCourses} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashhboard;