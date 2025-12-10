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
import Settings from "./client/settings";
import QuizPage from "./client/quiz/quizPage";
import QuizResult from "./client/quiz/quizResult";
import QuizOverview from "./client/quiz/quizOverview";
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
          <Route path="/settings" element={<Settings />} />
          <Route path="/quiz/start/:id" element={<QuizPage />} />
          <Route path="/quiz/overview/:id" element={<QuizOverview />} />
          <Route path="/quiz/result/:id" element={<QuizResult />} />

          <Route path="/courses/overview/:id" element={<Overview />} />
        </Routes>
      </div>
    </div>
  );
}
