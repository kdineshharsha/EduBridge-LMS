import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import { ArrowRight, Loader2 } from "lucide-react";
import CourseCardSkeleton, { CourseSkeletonGrid } from "./courseCardSkeleton";

export default function CourseSection({ title, query }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `/api/course/filter?${query}`)
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, [query]);

  return (
    <section className="md:my-16 ">
      <div className="flex justify-between items-center my-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
            {title}
          </h1>
        </div>
        <a
          href={`/courses?${query}`}
          className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-300 hover:gap-3"
        >
          View All
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {loading ? (
        <CourseSkeletonGrid count={4} />
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <p className="text-gray-600 font-medium">No courses found.</p>
          <p className="text-gray-500 text-sm mt-1">
            Check back soon for new content
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
