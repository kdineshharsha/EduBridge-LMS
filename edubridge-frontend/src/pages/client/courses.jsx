import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../../components/courseCard";

export default function Courses() {
  const [courselist, setCourselist] = useState([]);
  const [courseLoaded, setCourseLoaded] = useState(false);

  function fetchCourses() {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/course/")
      .then((response) => {
        setCourselist(response.data);
        setCourseLoaded(true); // ✅ Move this here
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourseLoaded(true);
      });
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="w-full  p-3  lg:p-4  ">
      {courseLoaded ? (
        courselist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 ">
            {courselist.map((course, index) => (
              <div key={index}>
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
        <div>
          <h2>Loading...</h2>
        </div>
      )}
    </div>
  );
}
