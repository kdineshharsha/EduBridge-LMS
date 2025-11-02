import React from "react";
import { Star } from "lucide-react";
import { SlArrowRight, SlBadge } from "react-icons/sl";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-purple-200 flex flex-col h-full ">
      {/* Course Image */}
      <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden rounded-t-xl">
        <img
          src={course.thumbnail || "/placeholder.png"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {course.isFree && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-x-2">
              <SlBadge className="w-4 h-4" />
              Free
            </span>
          </div>
        )}
        {course.badge && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-teal-500/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
              {course.badge}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-indigo-900/90 backdrop-blur-sm px-3 py-1 rounded-md">
          <span className="text-white text-xs font-semibold flex items-center">
            <span className="mr-1">📊</span>
            {course.instructor?.firstName + " " + course.instructor?.lastName}
          </span>
        </div>
      </div>

      {/* Course Details */}

      <div className="p-4 flex flex-col flex-grow space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-base  line-clamp-2 group-hover:text-purple-600 transition-colors">
          {course.title}
        </h3>
        {course.categories && course.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 ">
            {course.categories.slice(0, 2).map((cat, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
              >
                {cat}
              </span>
            ))}
            {course.categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                +{course.categories.length - 2}
              </span>
            )}
          </div>
        )}
        {/* Description */}
        <p className="text-sm text-gray-500  line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        {/* <p className="text-sm text-gray-500 mb-3">
          {course.instructor?.firstName + " " + course.instructor?.lastName}
        </p> */}

        {/* Rating */}
        {course.ratingCount !== undefined && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-gray-900">
                {course.ratingAverage?.toFixed(1) || "0.0"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({course.ratingCount} ratings)
            </span>
          </div>
        )}

        {/* Spacer to push price and button to bottom */}
        <div className="flex-grow"></div>

        {/* Price */}
        <div className=" border-t border-gray-100">
          <div className="flex items-center gap-2 ">
            <span className="text-xl font-bold text-gray-900">
              Rs.{course.price}
            </span>
            {course.originalPrice && course.originalPrice !== course.price && (
              <span className="text-sm text-gray-400 line-through">
                Rs.{course.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Enroll Button */}
        <Link
          to={`/courses/overview/${course._id}`}
          className="w-full text-center py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Enroll Now
        </Link>
      </div>
    </div>
  );
}
