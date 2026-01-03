import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  Bell,
  Search,
  MoreVertical,
  TrendingUp,
  Star,
  Settings,
  Calendar,
  ArrowUpRight,
  Filter,
  PieChart,
  Activity
} from 'lucide-react';

const Testing = () => {
  // --- Dummy Data ---
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+12.5%",
      icon: DollarSign,
      color: "bg-indigo-600 text-white",
      trend: "up"
    },
    {
      title: "Active Students",
      value: "1,234",
      change: "+5.2%",
      icon: Users,
      color: "bg-white text-indigo-600 border border-indigo-100",
      trend: "up"
    },
    {
      title: "Active Courses",
      value: "12",
      change: "0%",
      icon: BookOpen,
      color: "bg-white text-indigo-600 border border-indigo-100",
      trend: "neutral"
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "bg-white text-indigo-600 border border-indigo-100",
      trend: "up"
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: "Complete React Native Bootcamp 2024",
      category: "Development",
      students: 450,
      sales: 120,
      price: "$89.99",
      status: "Published",
      image: "https://placehold.co/100x100/6366f1/white?text=RN"
    },
    {
      id: 2,
      title: "Advanced UI/UX Design Principles",
      category: "Design",
      students: 230,
      sales: 85,
      price: "$75.00",
      status: "Draft",
      image: "https://placehold.co/100x100/ec4899/white?text=UX"
    },
    {
      id: 3,
      title: "Python for Data Science Masterclass",
      category: "Data Science",
      students: 890,
      sales: 340,
      price: "$99.99",
      status: "Published",
      image: "https://placehold.co/100x100/fbbf24/black?text=PY"
    },
    {
      id: 4,
      title: "Digital Marketing Fundamentals",
      category: "Marketing",
      students: 150,
      sales: 45,
      price: "$49.99",
      status: "Review",
      image: "https://placehold.co/100x100/10b981/white?text=DM"
    }
  ];

  // --- Custom Charts ---

  // 1. Smooth Area Line Chart (Revenue)
  const RevenueChart = () => (
    <div className="w-full h-64 mt-4 relative group">
      <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="0" y1={300 - i * 75} x2="800" y2={300 - i * 75} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
        ))}

        {/* Path */}
        <path
          d="M0,250 C120,280 240,150 320,180 C400,210 480,100 560,120 C640,140 720,50 800,80"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="4"
          strokeLinecap="round"
          className="drop-shadow-md"
        />
        <path
          d="M0,250 C120,280 240,150 320,180 C400,210 480,100 560,120 C640,140 720,50 800,80 V300 H0 Z"
          fill="url(#revenueGradient)"
          stroke="none"
        />

        {/* Hover Points (Visual only) */}
        <circle cx="320" cy="180" r="6" fill="white" stroke="#4f46e5" strokeWidth="3" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <circle cx="560" cy="120" r="6" fill="white" stroke="#4f46e5" strokeWidth="3" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
      </svg>
      <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium px-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}
      </div>
    </div>
  );

  // 2. Bar Chart (Activity)
  const ActivityChart = () => (
    <div className="w-full h-64 mt-4 flex items-end justify-between gap-3 sm:gap-4">
      {[65, 45, 75, 55, 85, 40, 70].map((height, i) => (
        <div key={i} className="w-full h-full flex flex-col justify-end group">
          <div className="w-full bg-gray-100 rounded-xl relative overflow-hidden h-full">
            <div
              className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-xl transition-all duration-500 group-hover:bg-indigo-600"
              style={{ height: `${height}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 mt-3 font-medium">
            {['12', '13', '14', '15', '16', '17', '18'][i]}
          </div>
        </div>
      ))}
    </div>
  );

  // 3. Radial Progress Chart
  const ProgressChart = ({ percent, color, label }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`${color} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{percent}%</span>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 mt-2">{label}</span>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#F8F9FC] font-[Poppins] text-gray-800">

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Oct 15 - Nov 15</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-50'
                    }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Revenue Trends (Line Chart) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Revenue Trends</h2>
                  <p className="text-sm text-gray-400">Monthly revenue growth</p>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <RevenueChart />
            </div>

            {/* Progress & Quick Stats */}
            <div className="flex flex-col gap-6">
              {/* Radial Charts Row */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Course Status</h2>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-around">
                  <ProgressChart percent={75} color="text-indigo-600" label="Completed" />
                  <ProgressChart percent={45} color="text-emerald-500" label="In Progress" />
                </div>
              </div>

              {/* Mini Promo Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BookOpen className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-2 relative z-10">Pro Instructor</h3>
                <p className="text-indigo-100 text-sm mb-4 relative z-10">Unlock advanced analytics and more features.</p>
                <button className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-lg relative z-10 hover:bg-indigo-50 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section: Activity + Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Bar Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Learning Activity</h2>
                  <p className="text-sm text-gray-400">Hours spent per day</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <ActivityChart />
            </div>

            {/* Recent Courses Table (Takes 2 columns) */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Top Performing Courses</h2>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</a>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Course Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sales</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={course.image} alt="" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{course.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{course.students} students</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{course.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-700">{course.sales}</span>
                            <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${course.status === "Published"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : course.status === "Draft"
                                  ? "bg-gray-50 text-gray-500 border border-gray-100"
                                  : "bg-amber-50 text-amber-600 border border-amber-100"
                              }`}
                          >
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900 text-sm">{course.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default Testing;