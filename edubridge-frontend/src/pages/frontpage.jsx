import React from "react";
import TopNavbar from "../components/topNavbar";
import { Route, Routes } from "react-router-dom";
import Contacts from "./client/contacts";
import HomePage from "./client/homePage";
import Courses from "./client/courses";
import AddCourse from "./instructor/addCourse";
import InstructorPage from "./instructorPage";
import Overview from "./client/Overview";
import Profile from "./client/profile";
import MyCourses from "./client/myCourses";
import AboutUs from "./client/aboutUs";
import BottomNavbar from "../components/bottomNavbar";
export default function FrontPage() {
  return (
    <div className=" w-full bg-background poppins-regular  ">
      <TopNavbar />
      <BottomNavbar />

      <div className="w-full  bg-gray-200 min-h-screen ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/courses/" element={<Courses />} />
          <Route path="/about/" element={<AboutUs />} />
          <Route path="/courses/overview/:id" element={<Overview />} />
        </Routes>
      </div>
    </div>
  );
}
