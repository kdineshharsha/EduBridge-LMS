import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  async function sendEmail() {
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/sendMail",
        { email }
      );
      toast.success("OTP has been sent to your email");
      setEmailSent(true); // switch to phase 2
    } catch (error) {
      console.error(error);
      toast.error("Error sending OTP");
    }
  }

  async function resetPassword() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/user/changePassword",
        { email, otp, password }
      );
      toast.success("Password changed successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error changing password");
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black to-purple-800 p-4">
      <div className="relative flex w-full lg:w-1/2 h-full bg-gray-900/40 p-10 flex-col justify-center backdrop-blur-2xl rounded-xl max-w-2xl overflow-hidden">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" className="size-40" alt="Logo" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-10 text-center">
          Reset Password
        </h1>

        {/* Container for sliding forms */}
        <div className="relative w-full h-full overflow-hidden ">
          {/* Phase 1: Email input */}
          <div
            className={`absolute w-full px-1 transition-transform duration-500  ${
              emailSent ? "-translate-x-full " : "translate-x-0"
            }`}
          >
            <label className="text-white mb-2">Email</label>
            <input
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 mt-2 p-3 w-full rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={sendEmail}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Send OTP
            </button>
          </div>

          {/* Phase 2: OTP + New Password */}
          <div
            className={`absolute w-full transition-transform duration-500 px-1 ${
              emailSent ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <label className="text-white mb-2">Enter the OTP</label>
            <input
              required
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-4 mt-2 p-3 w-full rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="text-white mb-2">New Password</label>
            <input
              required
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 mt-2 p-3 w-full rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="text-white mb-2">Re-enter Password</label>
            <input
              required
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-6 mt-2 p-3 w-full rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={resetPassword}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Reset Password
            </button>

            <p className="text-gray-400 mt-6 text-center">
              Is this the correct email?
              <span
                onClick={() => setEmailSent(false)}
                href="#"
                className="text-purple-400 cursor-pointer"
              >
                Re-enter the email
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
