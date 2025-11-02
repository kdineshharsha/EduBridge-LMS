import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import LoginCarousel from "../components/loginCarousel";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (response) => {
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/user/google", {
          accessToken: response.access_token,
        })
        .then((res) => {
          toast.success("Login successful");
          login(res.data.user, res.data.token);
          const user = res.data.user;
          console.log(user);

          if (user.role === "admin") {
            navigate("/admin");
          } else if (user.role === "instructor") {
            navigate("/instructor");
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Google login failed", err);
          toast.error("Google login failed");
        });
    },

    onError: (error) => {
      console.error("Login failed", error);
      toast.error("Login failed");
    },
  });
  async function handleLogin() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login",
        { email, password }
      );

      toast.success("Login successful");
      console.log(response.data);
      login(response.data.user, response.data.token);

      const user = response.data.user;

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error(error);
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center  bg-gradient-to-br from-black to-purple-800 p-4  ">
      {/* Left side - Login Page Carousel */}
      <div className="w-full  h-full flex justify-center  overflow-hidden shadow-2xl max-w-7xl">
        <div className="hidden lg:flex w-1/2 h-full bg-transparent relative ">
          <LoginCarousel />
          <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
            <h1 className="text-5xl font-bold drop-shadow-lg">
              Learn <br />
              Anytime <br /> Anywhere
            </h1>
            <br />
            <p className="text-md opacity-90">
              “Our Learning Management System connects students and instructors
              in one powerful platform, offering interactive lessons, progress
              tracking, and seamless communication to enhance education anytime,
              anywhere.”
            </p>
          </div>
        </div>
        {/* Right side - Login Form */}
        <div className="flex w-full lg:w-1/2 h-full bg-gray-900/40 p-10 flex-col justify-center backdrop-blur-2xl rounded-r-xl max-w-2xl ">
          <div className=" flex items-center justify-center">
            <img src="/logo.png" className="size-40" alt="" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Welcome to EduBridge
          </h1>
          <label className="text-white mb-2">Email</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 w-full rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-2 outline-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 "
          />
          <label className="text-white mb-2">Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-3 w-full rounded-lg bg-gray-800 text-white placeholder-gray-400  outline-2 outline-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center justify-between text-sm pb-6">
            <label className="flex items-center gap-2 text-white">
              <input type="checkbox" className="form-checkbox text-accent" />
              Remember Me
            </label>
            <p
              className="text-white hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              {/* <Link to="/reset"> */}
              Forgot Password?
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-3 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => loginWithGoogle()}
              className="flex  w-full justify-center items-center gap-2 bg-gray-800 text-white py-3 rounded-lg border border-gray-600 hover:bg-gray-700"
            >
              <FcGoogle size={24} /> Login with Google
            </button>
          </div>
          <p className="text-gray-400 mb-6 text-center">
            Don't have an account?{" "}
            <a href="#" className="text-purple-400 cursor-pointer">
              <Link to="/register">Sign Up</Link>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
