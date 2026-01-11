import { useState } from "react";
import {
    Eye,
    EyeOff,
    Ban,
    Trash2,
    User,
    BookOpen,
    AlertTriangle,
} from "lucide-react";

import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Loader from "../../components/Loader";


export default function EditCourse() {
    const [isPublished, setIsPublished] = useState(true);
    const [isSuspended, setIsSuspended] = useState(false);
    const [note, setNote] = useState("");
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchCourse() {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/course-manage/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setCourse(res.data);
                console.log(res.data);
                setIsPublished(res.data.isPublished);
                setIsSuspended(res.data.isSuspended);
                setNote(res.data.adminNote || "");
            } catch (err) {
                console.error("Failed to load course", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);


    if (loading) {
        return (
            <div className="flex bg-white items-center justify-center h-full py-40">
                <Loader />
            </div>
        );
    }








    return (
        <div className="h-full bg-white rounded-lg md:p-6 lg:p-8 py-6 px-2 overflow-y-scroll scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="mb-8">
                    <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Course Management
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    Manage and organize your courses
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                {/* HEADER */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

                    <div className="relative flex items-start gap-6">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-80 h-44 object-cover rounded-xl border shadow-sm"
                        />

                        <div className="flex-1 space-y-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {course.title}
                            </h1>

                            <p className="text-gray-600">
                                {course.categories.join(" • ")}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                {course.instructor.firstName} {course.instructor.lastName}
                                <span className="text-gray-400">—</span>
                                {course.instructor.email}
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-2">
                                <span>💰 Rs. {course.price.toLocaleString()}</span>
                                <span>👥 {course.enrolledCount} enrollments</span>
                                <span>📅 {new Date(course.createdAt).toLocaleDateString()}</span>
                                <span className="text-sm text-gray-600">
                                    ⭐ <span className="font-semibold text-gray-900">{course.rating}</span>
                                    <span className="ml-1 text-gray-500">({course.ratingCount} reviews)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* STATUS + ACTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* STATUS CARD */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm  space-y-4">
                        <h2 className="font-bold text-gray-900">Course Status</h2>

                        <div className="flex justify-between text-sm">
                            <span>Visibility</span>
                            <span className={isPublished ? "text-green-600" : "text-gray-500"}>
                                {isPublished ? "Published" : "Unpublished"}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>State</span>
                            <span className={isSuspended ? "text-red-600" : "text-green-600"}>
                                {isSuspended ? "Suspended" : "Active"}
                            </span>
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="font-bold text-gray-900">Quick Actions</h2>

                        <button
                            onClick={() => setIsPublished(!isPublished)}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${isPublished
                                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {isPublished ? <EyeOff /> : <Eye />}
                            {isPublished ? "Unpublish Course" : "Publish Course"}
                        </button>


                        <button
                            onClick={() => setIsSuspended(!isSuspended)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                        >
                            <Ban />
                            {isSuspended ? "Unsuspend Course" : "Suspend Course"}
                        </button>
                    </div>

                    {/* DANGER ZONE */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4 shadow-sm">
                        <h2 className="font-bold text-red-700 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </h2>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">
                            <Trash2 />
                            Delete Course Permanently
                        </button>

                        <p className="text-xs text-red-600 text-center">
                            This action cannot be undone. All lessons & enrollments will be lost.
                        </p>
                    </div>

                </div>

                {/* ADMIN NOTES */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm  space-y-4">
                    <h2 className="font-bold text-gray-900">Admin Notes</h2>

                    <textarea
                        className="w-full h-32 border border-gray-300 rounded-xl p-4 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Internal notes, warnings, suspension reason..."
                    />

                    <div className="flex justify-end">
                        <button className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                            Save Note
                        </button>
                    </div>
                </div>

                {/* COURSE CONTENT PREVIEW */}
                <div className="rounded-2xl p-6 shadow-sm bg-red-50 border border-red-200">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Course Content (Preview)
                    </h2>

                    <ul className="space-y-2 text-sm text-gray-700">
                        {course.lessons.map((lesson, index) => (
                            <li
                                key={lesson._id}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
                            >
                                <span className="text-xs font-bold text-gray-400">
                                    {index + 1}.
                                </span>
                                <span>{lesson.title}</span>
                            </li>
                        ))}
                    </ul>


                </div>

            </div>
        </div>
    );
}
