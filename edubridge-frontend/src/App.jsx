import React from "react";
import LoginPage from "./pages/loginPage";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/client/register";
import SelectRole from "./pages/client/selectRole";
import { GoogleOAuthProvider } from "@react-oauth/google";
import InstrctorDashboard from "./pages/client/instructorDashboard";
import AdminPage from "./pages/admin/adminPage";
import ForgotPass from "./pages/client/forgotPass";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instructor" element={<InstrctorDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
