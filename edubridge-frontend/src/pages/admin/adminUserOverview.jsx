import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    User,
    Mail,
    Calendar,
    Ban,
    CheckCircle,
    AlertTriangle,
    BookOpen,
    GraduationCap,
    Users,
    Loader2,
    Power
} from "lucide-react";

export default function AdminUserOverview() {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(res.data.user);
                setCourses(res.data.courses || []);
            } catch (err) {
                console.error("Failed to load user", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [id, token]);

    // ================== TOGGLE STATUS FUNCTION ==================
    const handleToggleStatus = async () => {
        // 1. Define message based on current state (Visual only)
        const confirmMessage = user.isDisabled
            ? `Are you sure you want to ENABLE ${user.firstName}'s account?`
            : `Are you sure you want to DISABLE ${user.firstName}'s account?`;

        // 2. Confirm Action
        if (!window.confirm(confirmMessage)) return;

        setActionLoading(true);
        try {
            // 3. Call the SAME endpoint for both actions
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/disable/${id}`,
                {}, // Empty body
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // 4. Update local state by flipping the boolean
            setUser(prev => ({ ...prev, isDisabled: !prev.isDisabled }));

        } catch (error) {
            console.error("Failed to toggle user status", error);
            alert("Failed to update user status. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <AlertTriangle className="w-10 h-10 mb-2 text-yellow-500" />
                <p>User not found</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-white rounded-lg p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ================= HEADER ================= */}
                <div className="mb-8  ">
                    <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Users Management
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    Manage and organize your users
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ================= USER PROFILE CARD ================= */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                        {/* Avatar & Name */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                                {user.firstName?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'instructor' ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'}`}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-3 text-sm text-gray-600 md:col-span-1">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col items-end gap-3 md:col-span-1">
                            {/* Status Badge */}
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border
                                ${user.isDisabled
                                    ? "bg-red-50 text-red-700 border-red-100"
                                    : "bg-green-50 text-green-700 border-green-100"
                                }`}>
                                {user.isDisabled ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                {user.isDisabled ? "Account Disabled" : "Active Account"}
                            </div>

                            {/* Single Toggle Button */}
                            <button
                                onClick={handleToggleStatus}
                                disabled={actionLoading}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm min-w-[140px] justify-center
                                    ${user.isDisabled
                                        ? "bg-green-600 hover:bg-green-700"  // Green button to Enable
                                        : "bg-red-600 hover:bg-red-700"      // Red button to Disable
                                    }
                                    ${actionLoading ? "opacity-70 cursor-not-allowed" : ""}
                                `}
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    user.isDisabled ? <Power className="w-4 h-4" /> : <Ban className="w-4 h-4" />
                                )}
                                {actionLoading
                                    ? "Processing..."
                                    : (user.isDisabled ? "Enable Account" : "Disable Account")
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= ROLE BASED CONTENT ================= */}

                {/* STUDENT VIEW */}
                {user.role === "student" && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            Enrolled Courses
                        </h2>

                        {courses.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No enrolled courses found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {courses.map((course) => (
                                    <div key={course._id} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-24 h-16 shrink-0 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {course.isFree ? "Free" : `Rs. ${course.price.toLocaleString()}`}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${course.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {course.isPublished ? "Live" : "Draft"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* INSTRUCTOR VIEW */}
                {user.role === "instructor" && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <GraduationCap className="w-5 h-5 text-orange-500" />
                            Created Courses
                        </h2>

                        {courses.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">This instructor hasn't created any courses yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {courses.map((course) => (
                                    <div key={course._id} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-24 h-16 shrink-0 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                {course.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-2 mt-1">
                                                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                    <Users className="w-3 h-3" /> {course.enrolledCount || 0}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block" />
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {course.isFree ? "Free" : `Rs. ${course.price.toLocaleString()}`}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ml-auto sm:ml-0 ${course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {course.isPublished ? "Published" : "Draft"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}