import React from "react";
import LoginPage from "./pages/loginPage";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/client/register";
import SelectRole from "./pages/client/selectRole";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgotPass from "./pages/client/forgotPass";
import AdminPage from "./pages/adminPage";
import FrontPage from "./pages/frontpage";
import Testing from "./pages/testing";
import InstructorPage from "./pages/instructorPage";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/*" element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/instructor/*" element={<InstructorPage />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
