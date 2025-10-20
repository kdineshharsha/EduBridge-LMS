import React from "react";
import TopNavbar from "../components/topNavbar";
import { Route, Routes } from "react-router-dom";
import Contacts from "./client/contacts";
import HomePage from "./client/homePage";
import Courses from "./client/courses";
import AddCourse from "./instructor/addCourse";
import InstructorPage from "./instructorPage";
export default function FrontPage() {
  return (
    <div className=" w-full bg-background poppins-regular ">
      <TopNavbar />
      <div className="w-full h-screen bg-blue-400 ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/courses/*" element={<Courses />} />
        </Routes>
      </div>
    </div>
  );
}
