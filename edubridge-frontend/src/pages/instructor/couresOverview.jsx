import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { GoVersions } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import Testing from "../testing";
import Accordion from "../../components/accordian";
import axios from "axios";
import CourseLessons from "../../components/accordian";

export default function CourseOverview() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const params = useParams();

  useEffect(() => {
    if (!params.id) window.location.href = "/courses";

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/course/${params.id}`
        );
        setCourses(response.data);
        console.log(response.data.lessons);
        setLessons(response.data.lessons);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setIsLoaded(true);
      }
    };

    fetchCourses();
  }, [params.id]);

  return (
    <div className="h-full overflow-y-scroll w-full bg-white rounded-xl lg font-semibold md:p-6 py-6 px-2">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
              <GoVersions className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Course Overview
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage and organize your course
              </p>
            </div>
          </div>

          {/* Flag */}

          {/* <Link
            to="add-course/"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-xl text-white hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-200 font-semibold text-sm shadow-md hover:scale-105 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </Link> */}
        </div>
      </div>

      {/* Stats Overview */}
      {isLoaded && courses.enrolledStudents && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">
              Students Enrollments
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {courses.enrolledStudents.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {courses.enrolledStudents.length * courses.price}
            </p>
          </div>
        </div>
      )}

      {/* Content Section */}
      {/* <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Lessons</h3>
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="border p-3 rounded-md mb-2 bg-gray-50 shadow-sm"
          >
            <h4 className="font-medium">{lesson.title}</h4>
            <p className="text-sm text-gray-600">
              Duration: {lesson.duration} minutes
            </p>
          </div>
        ))}
      </div> */}
      <div className="py-4">
        <h1 className="text-2xl font-semibold">{courses.title}</h1>
      </div>
      <div className=" w-full">
        {" "}
        <CourseLessons lessons={lessons} thumbnail={courses.thumbnail} />
      </div>
    </div>
  );
}
