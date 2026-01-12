import {
  GraduationCap,
  BookOpen,
  BarChart3,
  Laptop,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: GraduationCap,
      title: "Expert Instructors",
      description:
        "Learn from experienced instructors who are professionals in their fields.",
    },
    {
      icon: BookOpen,
      title: "Well-Structured Courses",
      description:
        "Courses are carefully designed with lessons, quizzes, and clear learning paths.",
    },
    {
      icon: Sparkles,
      title: "Interactive Learning",
      description:
        "Engaging lessons, quizzes, and real-time feedback to improve understanding.",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Track your learning progress, quiz attempts, and achievements easily.",
    },
    {
      icon: Laptop,
      title: "Learn Anytime, Anywhere",
      description:
        "Access your courses from any device, at any time, from anywhere.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      description:
        "Your data and learning progress are protected with modern security standards.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose <span className="text-blue-600">EduBridge?</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Everything you need to learn, teach, and grow — all in one powerful
            learning platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition">
            Start Learning Today
          </button>
        </div>
      </div>
    </section>
  );
}
