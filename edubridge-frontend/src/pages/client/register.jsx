import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import LoginCarousel from "../../components/loginCarousel";
import { useGoogleLogin } from "@react-oauth/google";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (response) => {
      console.log("Login successful", response);
      navigate("/select-role", {
        state: {
          accessToken: response.access_token,
        },
      });
    },

    onError: (error) => {
      console.log("Login failed", error);
      toast.error("Login failed");
    },
  });

  async function handleRegister(e) {
    e.preventDefault();
    navigate("/select-role", {
      state: {
        email,
        password,
        firstName,
        lastName,
        phone,
      },
    });
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black to-purple-800 p-4">
      <div className="w-full h-full flex justify-center overflow-hidden shadow-2xl max-w-7xl">
        {/* Left side - Carousel */}
        <div className="hidden lg:flex w-1/2 h-full bg-transparent relative">
          <LoginCarousel />
          <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
            <h1 className="text-5xl font-bold drop-shadow-lg">
              Learn <br /> Anytime <br /> Anywhere
            </h1>
            <br />
            <p className=" text-md opacity-90">
              “Our Learning Management System connects students and instructors
              in one powerful platform, offering interactive lessons, progress
              tracking, and seamless communication to enhance education anytime,
              anywhere.”
            </p>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="flex w-full lg:w-1/2 h-full bg-gray-900/40 p-10 flex-col justify-center backdrop-blur-2xl rounded-r-xl max-w-2xl overflow-y-scroll scrollbar-hide ">
          <div className="flex items-center justify-center p-8">
            {/* <img src="/logo.png" className="size-36" alt="EduBridge Logo" /> */}
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Create an Account
          </h1>

          <form
            autoComplete="off"
            onSubmit={handleRegister}
            className="flex flex-col gap-4"
          >
            <div className="flex lg:flex-row flex-col gap-4 ">
              <div className="flex-1 flex flex-col">
                <label className="text-white mb-2">First Name</label>
                <input
                  required
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-white mb-2">Last Name</label>
                <input
                  required
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <label className="text-white">Email</label>
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="text-white">Phone</label>
            <input
              required
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="text-white">Password</label>
            <input
              required
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Register
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-3 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          <button
            onClick={() => loginWithGoogle()}
            className="flex w-full justify-center items-center gap-2 bg-gray-800 text-white py-3 rounded-lg border border-gray-600 hover:bg-gray-700"
          >
            <FcGoogle size={24} /> Sign Up with Google
          </button>

          <p className="text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
