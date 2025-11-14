import { Sparkles } from "lucide-react";
import CourseSection from "../../components/courseSection";
import Footer from "../../components/fotter";
import { useNavigate } from "react-router-dom";
import FeedbackCarousel from "../../components/feedbackCarousel";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex  md:flex-row items-center justify-between h-auto md:h-screen ">
        {/* Left Section */}
        <div
          className="relative sm:w-[55%] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white px-8 md:px-12 py-10 md:py-24 flex flex-col justify-center
             sm:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/30 border border-blue-300/50 rounded-full text-xs font-medium tracking-wider w-fit mb-8">
            <Sparkles className="w-3 h-3" />
            ENHANCE YOUR LIFE
          </div>

          {/* Headings */}
          <div className="space-y-2 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Transform
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-indigo-300">Your Skills and</span>
            </h1>
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Career!
              </h1>
              <svg
                className="absolute -bottom-3 left-0 w-56 md:w-72"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 6C100 3, 200 3, 298 6"
                  stroke="#a78bfa"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Description */}
          <p className="text-indigo-100 text-base md:text-lg mb-10 max-w-lg leading-relaxed">
            Learn from top instructors and master new skills to take your career
            to the next level. Join thousands of students achieving success with
            EduBridge.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate("/courses")}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all w-fit shadow-lg"
          >
            Browse Courses
          </button>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 md:gap-12 mt-12 md:mt-16">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                769+
              </div>
              <div className="text-sm text-indigo-200">Recorded Videos</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                1200+
              </div>
              <div className="text-sm text-indigo-200">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                10+
              </div>
              <div className="text-sm text-indigo-200">Course Topics</div>
            </div>
          </div>
        </div>

        {/* Right Section - Hidden on mobile */}
        <div className="hidden sm:flex w-[45%] items-center justify-center relative ">
          <div className="relative">
            {/* Student Image */}
            <div className="absolute top-0 left-0 w-100 h-100  ring-8 ring-indigo-500 rounded-full"></div>
            <div className="relative z-10 w-80 h-[600px]">
              <img
                src="heroBG.png"
                alt="Student"
                className="w-full h-full object-cover [filter:drop-shadow(0_0_25px_rgba(99,102,241,0.6))]"
              />
            </div>

            {/* Purple accent folder */}
            <div className="absolute bottom-16 right-8 w-48 h-56 bg-purple-400 rounded-xl -z-10 transform rotate-6 shadow-lg"></div>

            {/* Blue curved element behind */}
            <div
              className="absolute top-24 -right-12 w-80 h-80 bg-indigo-500 rounded-[3rem] -z-20 shadow-md"
              style={{
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            ></div>

            {/* Testimonial */}
            <div className="absolute -bottom-8 left-0 bg-white rounded-2xl shadow-2xl p-6 w-72 z-20">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    alt="Adam Smith"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">
                    Adam Smith
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Student | Batch 01
                  </div>
                </div>
              </div>
              <div className="mt-3 relative pl-3">
                <span className="absolute left-0 top-0 text-3xl text-indigo-500 font-serif leading-none">
                  "
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  A fantastic platform that made learning simple, structured,
                  and fun! Highly recommend EduBridge to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:mt-24 px-6  ">
        <CourseSection title="Free Courses" query="type=free" />
        <CourseSection
          title="Top Courses in Web Development"
          query="category=Web Development"
        />
        <CourseSection
          title="Top Courses in Business"
          query="category=Business"
        ></CourseSection>
      </div>
      <FeedbackCarousel />
      <Footer />
    </div>
  );
}
