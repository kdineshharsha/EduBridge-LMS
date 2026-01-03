import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
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

const Dashboard = () => {

    const [stats, setStats] = useState(null)
    const [dailyRevenue, setDailyRevenue] = useState([]);

    const token = localStorage.getItem("token");

    // Fetch Summary
    useEffect(() => {
        async function fetchSummary() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/instructor/summary`, {
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
        async function fetchDailyRevenue() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/instructor/revenue-chart`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setDailyRevenue(res.data);
            } catch (err) {
                console.error("Error fetching daily revenue:", err);
            }
        }
        fetchDailyRevenue();
    }, []);

    // --- CHART DATA PREPARATION ---
    function normalizeDailyRevenue(data, days = 7) {
        const map = new Map(data.map(d => [d.date, d.revenue]));
        const result = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().slice(0, 10);

            result.push({
                date: key,
                revenue: map.get(key) || 0,
            });
        }
        return result;
    }

    const chartData = normalizeDailyRevenue(dailyRevenue, 7);

    // --- APEXCHARTS CONFIGURATION (BLUE THEME) ---
    const chartOptions = {
        chart: {
            type: 'area',
            height: 350,
            fontFamily: 'Poppins, sans-serif',
            toolbar: {
                show: true, // Keep zoom/pan controls enabled
                tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                },
            },
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            }
        },
        colors: ['#3b82f6'], // BLUE THEME (Blue-500)
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            type: 'datetime',
            categories: chartData.map(item => item.date),
            labels: {
                rotate: -45,
                style: { colors: '#9ca3af', fontSize: '12px' },
                format: 'MMM dd'
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: {
            show: true,
            labels: {
                style: { colors: '#9ca3af', fontSize: '12px' },
                formatter: (value) => {
                    if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
                    return value;
                }
            },
        },
        grid: {
            show: true,
            borderColor: '#f3f4f6',
            strokeDashArray: 4,
            yaxis: { lines: { show: true } },
            xaxis: { lines: { show: false } },
            padding: { top: 0, right: 0, bottom: 0, left: 10 }
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (val) {
                    return "Rs. " + val.toLocaleString();
                }
            }
        },
        markers: {
            size: 0,
            hover: { size: 6 }
        }
    };

    const chartSeries = [{
        name: 'Revenue',
        data: chartData.map(item => item.revenue)
    }];

    // --- HELPER DATA FOR UI ---
    // Updated colors to Blue-600/Blue-100
    const statCards = stats ? [
        { title: "Total Revenue", value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-blue-600 text-white" },
        { title: "Active Students", value: stats.totalStudents.toLocaleString(), icon: Users, color: "bg-white text-blue-600 border border-blue-100" },
        { title: "Active Courses", value: stats.activeCourses, icon: BookOpen, color: "bg-white text-blue-600 border border-blue-100" },
        { title: "Avg. Rating", value: stats.avgRating, icon: Star, color: "bg-white text-blue-600 border border-blue-100" },
    ] : [];

    const recentCourses = [
        { id: 1, title: "Complete React Native Bootcamp 2024", category: "Development", students: 450, sales: 120, price: "$89.99", status: "Published", image: "https://placehold.co/100x100/3b82f6/white?text=RN" },
        { id: 2, title: "Advanced UI/UX Design Principles", category: "Design", students: 230, sales: 85, price: "$75.00", status: "Draft", image: "https://placehold.co/100x100/ec4899/white?text=UX" },
        { id: 3, title: "Python for Data Science Masterclass", category: "Data Science", students: 890, sales: 340, price: "$99.99", status: "Published", image: "https://placehold.co/100x100/fbbf24/black?text=PY" },
        { id: 4, title: "Digital Marketing Fundamentals", category: "Marketing", students: 150, sales: 45, price: "$49.99", status: "Review", image: "https://placehold.co/100x100/10b981/white?text=DM" }
    ];

    const recentActivities = [
        { id: 1, user: "Alex Morgan", action: "enrolled in", target: "React Native Bootcamp", time: "2 min ago", icon: Users, color: "bg-blue-50 text-blue-600" },
        { id: 2, user: "Sarah L.", action: "completed", target: "Module 4: Flexbox", time: "15 min ago", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
        { id: 3, user: "System", action: "processed", target: "$450.00 Payout", time: "1 hour ago", icon: DollarSign, color: "bg-purple-50 text-purple-600" },
        { id: 4, user: "Mike Ross", action: "left a review", target: "Python Masterclass", time: "3 hours ago", icon: Star, color: "bg-amber-50 text-amber-600" }
    ];

    const ProgressChart = ({ percent, color, label }) => {
        const radius = 30;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        return (
            <div className="flex flex-col items-center justify-center p-4">
                <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${color} transition-all duration-1000 ease-out`} />
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
        <div className="h-full overflow-scroll scrollbar-hide bg-white rounded-lg font-[Poppins] text-gray-800">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Dashboard Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Dashboard Overview</h1>
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

                    {/* --- REVENUE CHART (BLUE THEME) --- */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
                                <p className="text-sm text-gray-500">Recent order revenue performance</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                    {/* Legend Dot -> Blue */}
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    <span className="text-xs font-semibold text-gray-600">Revenue</span>
                                </div>
                                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="w-full h-[350px]">
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries}
                                type="area"
                                height={350}
                            />
                        </div>
                    </div>

                    {/* Progress & Quick Stats */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Course Status</h2>
                                <PieChart className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-around">
                                {/* Radial Charts -> Blue */}
                                <ProgressChart percent={75} color="text-blue-600" label="Completed" />
                                <ProgressChart percent={45} color="text-emerald-500" label="In Progress" />
                            </div>
                        </div>

                        {/* Promo Card -> Blue Gradient */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex-1">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-24 h-24" /></div>
                            <h3 className="text-xl font-bold mb-2 relative z-10">Pro Instructor</h3>
                            <p className="text-blue-100 text-sm mb-4 relative z-10">Unlock advanced analytics and more features.</p>
                            <button className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-lg relative z-10 hover:bg-blue-50 transition-colors">Upgrade Now</button>
                        </div>
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
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Course Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sales</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Price</th>
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
                                            <td className="px-6 py-4"><span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{course.category}</span></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-700">{course.sales}</span>
                                                    <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                        {/* Progress Bar -> Blue */}
                                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${course.status === "Published" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : course.status === "Draft" ? "bg-gray-50 text-gray-500 border border-gray-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>{course.status}</span>
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
    );
};

export default Dashboard;