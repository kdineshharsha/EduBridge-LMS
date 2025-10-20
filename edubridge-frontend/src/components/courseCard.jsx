import React from "react";
import { Star } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer min-w-72">
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.png"}
          alt={course.title}
          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-3 left-3 bg-indigo-900/90 backdrop-blur-sm px-3 py-1 rounded-md">
          <span className="text-white text-xs font-semibold flex items-center">
            <span className="mr-1">📊</span>
            EduBridge
          </span>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 h-12">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          {course.instructor?.firstName + " " + course.instructor?.lastName}
        </p>

        {/* Rating and Badge */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {course.badge && (
            <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded">
              {course.badge}
            </span>
          )}
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-gray-900">
                {course.rating}
              </span>
            </div>
          )}
          {course.totalRatings && (
            <span className="text-xs text-gray-500">
              ({course.totalRatings} ratings)
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">
            Rs.{course.price}
          </span>
          <span className="text-sm text-gray-400 line-through">
            Rs.{course.originalPrice || course.price}
          </span>
        </div>
      </div>
    </div>
  );
}
