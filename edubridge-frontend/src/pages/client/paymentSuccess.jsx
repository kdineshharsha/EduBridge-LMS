import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const courseId = params.get("courseId");
  const userId = params.get("userId");
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/enroll/after-payment`, {
      courseId,
      userId,
    });

    toast.success("Payment successful! You're now enrolled 🎉");
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center border border-gray-100">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Successful!
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-lg mb-8">
          You are now enrolled in the course 💙 Start your journey now!
        </p>

        {/* Go to Course Button */}
        <button
          onClick={() => navigate(`/courses/overview/${courseId}`)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:opacity-90 transition-all"
        >
          Go to Course →
        </button>

        {/* Optional Back to Courses */}
        <button
          onClick={() => navigate("/my-courses")}
          className="mt-4 w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
        >
          Go to My Courses
        </button>
      </div>
    </div>
  );
}
