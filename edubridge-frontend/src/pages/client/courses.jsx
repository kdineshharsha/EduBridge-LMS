import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../../components/CourseCard";
import { LuSearch } from "react-icons/lu";
import Select from "react-select";
import CourseCardSkeleton, {
  CourseSkeletonGrid,
} from "../../components/courseCardSkeleton";
import { useLocation, useNavigate } from "react-router-dom";

export default function Courses() {
  const [courselist, setCourselist] = useState([]);
  const [courseLoaded, setCourseLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();

  const categoryOptions = [
    { value: "All", label: "All Categories" },
    { value: "Programming", label: "Programming" },
    { value: "Design", label: "Design" },
    { value: "Business", label: "Business" },
    { value: "Language", label: "Language" },
    { value: "Other", label: "Other" },
    { value: "UI/UX", label: "UI/UX" },
    { value: "Web Development", label: "Web Development" },
  ];

  function fetchCourses() {
    setCourseLoaded(false);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/course/")
      .then((response) => {
        setCourselist(response.data);
        setCourseLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourseLoaded(true);
      });
  }

  // read category from URL when component mounts or when search changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category") || "All";
    // ensure param value exists in options; fallback to All
    const allowed = categoryOptions.map((o) => o.value);
    setSelectedCategory(
      allowed.includes(categoryParam) ? categoryParam : "All"
    );
  }, [location.search]); // runs when URL search changes

  // fetch courses once
  useEffect(() => {
    fetchCourses();
  }, []);

  // When user changes category from the UI, update state AND the URL
  function handleCategoryChange(option) {
    const value = option.value;
    setSelectedCategory(value);

    const params = new URLSearchParams(location.search);
    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    // push new URL (replace: false) so user can navigate back
    navigate({ pathname: "/courses", search: params.toString() });
  }

  // ✅ Filter courses based on search and category
  const filteredCourses = courselist.filter((course) => {
    const matchesSearch =
      course.title &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (course.categories && course.categories.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full p-3 lg:p-4 bg-background">
      {/* 🔍 Search & Category Filter */}
      <div className="mb-4 p-6 gap-3 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></span>
            Explore Courses
          </h1>
        </div>
        <p className="text-base text-gray-500">
          Explore courses from experienced, real-world experts
        </p>

        <div className="flex w-full justify-between gap-3 flex-col sm:flex-row flex-wrap py-3">
          <div className="relative sm:w-1/2">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            {/* Clear (X) Button – only shows when there's text */}
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            ) : (
              <LuSearch className="absolute right-3 top-3 text-gray-400" />
            )}
          </div>

          <Select
            isSearchable={false}
            options={categoryOptions}
            value={categoryOptions.find(
              (opt) => opt.value === selectedCategory
            )}
            onChange={handleCategoryChange}
            className="w-full sm:w-1/3 lg:w-1/4"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#f9fafb",
                borderRadius: "12px",
                padding: "4px 8px",
                borderColor: "#d1d5db",
                boxShadow: "none",
                "&:hover": { borderColor: "#6366f1" },
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? "#6366f1"
                  : isFocused
                  ? "#e0e7ff"
                  : "white",
                color: isSelected ? "white" : "#111827",
                fontWeight: isSelected ? "600" : "normal",
                cursor: "pointer",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)",
              }),
            }}
          />
        </div>
      </div>

      {/* 📚 Course List */}
      {courseLoaded ? (
        filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {filteredCourses.map((course, index) => (
              <div key={course._id || index}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h2>No Courses Found</h2>
          </div>
        )
      ) : (
        <CourseSkeletonGrid count={8} />
      )}
    </div>
  );
}
