import { Link } from "react-router-dom";
import {
  BookOpen,
  Target,
  Users,
  Award,
  BarChart2,
  Rocket,
} from "lucide-react";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/40">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                Learn, build, and thrive with EduCraft LMS
              </h1>
              <p className="mt-5 text-gray-600 text-lg">
                Whether you want to learn a new skill, train your teams, or
                share what you know with the world, you’re in the right place.
                As a leader in online learning, we’re here to help you achieve
                your goals and transform your life.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  to="/courses"
                  className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
                >
                  Browse courses
                </Link>
                <Link
                  to="/contacts"
                  className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold ring-1 ring-gray-300 hover:bg-gray-50 transition"
                >
                  Contact us
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-2xl bg-white/60 backdrop-blur-sm ring-1 ring-gray-200 shadow-xl p-6">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Box 1 */}
                  <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                    <img
                      src="https://images.unsplash.com/photo-1508830524289-0adcbe822b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q291cnNlc3xlbnwwfHwwfHx8MA%3D%3D"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Box 2 */}
                  <div className="rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200">
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=60"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Box 3 */}
                  <div className="rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200">
                    <img
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Box 4 */}
                  <div className="rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200">
                    <img
                      src="https://images.unsplash.com/photo-1612215670548-612dd2de09ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGNlcnRpZmljYXRlfGVufDB8fDB8fHww"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Box 5 */}
                  <div className="rounded-xl overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200">
                    <img
                      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=60"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Box 6 */}
                  <div className="rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                    <img
                      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=60"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Our mission</h2>
            <p className="mt-3 text-gray-600">
              Empower learners with project-based courses, community support,
              and clear pathways from beginner to job-ready — all inside a
              clean, accessible interface.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Our vision</h2>
            <p className="mt-3 text-gray-600">
              A world where anyone can master modern skills — at their own pace
              — using tools that feel delightful, fast, and thoughtfully
              designed.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900">What we value</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard
            title="Clarity"
            desc="Simple interfaces, clear instructions, and consistent design language."
          />
          <ValueCard
            title="Practicality"
            desc="Real projects, hands-on modules, and career-focused flows."
          />
          <ValueCard
            title="Accessibility"
            desc="Inclusive defaults, keyboard-friendly, and readable contrast."
          />
          <ValueCard
            title="Community"
            desc="Peer learning, mentorship, and collaborative challenges."
          />
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <Stat label="Learners" value="1200+" />
            <Stat label="Projects" value="50+" />
            <Stat label="Instructors" value="100+" />
            <Stat label="Completion rate" value="92%" />
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Meet the Partners
            </h2>
            <p className="mt-3 text-gray-600">
              Cloud, platform, and content partners powering reliable, scalable
              learning infrastructure and course delivery.
            </p>
            <Link
              to="/team"
              className="mt-6 inline-flex px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
            >
              See the full team
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <TeamCard
              name="Google Cloud Platform"
              role="Cloud Services"
              img_url="https://img.icons8.com/?size=100&id=WHRLQdbEXQ16&format=png&color=000000"
            />
            <TeamCard
              name="IBM Institute"
              role="University Partnership"
              img_url="https://img.icons8.com/?size=100&id=31754&format=png&color=000000"
            />
            <TeamCard
              name="Vimeo"
              role="Hosting Partner"
              img_url="https://img.icons8.com/?size=100&id=21048&format=png&color=000000"
            />
            <TeamCard
              name="Stripe"
              role="Secure Payments"
              img_url="https://img.icons8.com/?size=100&id=vArWbbq0EbTM&format=png&color=000000"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold">Ready to start learning?</h3>
              <p className="mt-2 text-blue-100">
                Join courses designed for impact, with clean UI and real-world
                outcomes.
              </p>
            </div>
            <div className="flex gap-4 lg:justify-end">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-full bg-white text-indigo-700 font-semibold hover:bg-blue-50 transition"
              >
                Create account
              </Link>
              <Link
                to="/courses"
                className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold ring-1 ring-white/40 hover:bg-indigo-400 transition"
              >
                Explore courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ValueCard({ title, desc }) {
  return (
    <div className="group rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6 hover:shadow-md hover:ring-gray-300 transition">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
      <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-24 transition-all" />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-extrabold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function TeamCard({ name, role, img_url }) {
  return (
    <div className="flex items-center space-x-4 gap-2 p-2 md:p-4 rounded-xl bg-white ring-1 ring-gray-200 shadow-sm">
      <div className="size-12  ">
        <img src={img_url} alt="" />
      </div>
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
  );
}
