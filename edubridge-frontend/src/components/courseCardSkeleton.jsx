import React from "react";

export default function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-40 bg-gray-200 animate-pulse">
        <div className="absolute bottom-3 left-3 bg-gray-300 rounded-md w-32 h-7"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-grow space-y-2">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="flex gap-2 pt-1">
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-2 pt-2">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price Skeleton */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
      </div>
    </div>
  );
}

// Grid wrapper component for skeletons
function CourseSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
    </div>
  );
}

export { CourseSkeletonGrid };
