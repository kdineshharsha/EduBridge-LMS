import {
  Mail,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-16 lg:pb-8 pb-24 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-6 h-6" />
                Subscribe to Our Newsletter
              </h3>
              <p className="text-blue-100 text-sm">
                Get the latest courses, tips, and exclusive offers delivered to
                your inbox
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white w-full md:w-80"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
          {subscribed && (
            <div className="mt-4 text-center text-white font-semibold animate-pulse">
              ✓ Successfully subscribed!
            </div>
          )}
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EduCraft LMS
            </h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Transform your career with world-class online courses. Learn from
              industry experts and join a community of lifelong learners.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>123 Learning Street, Education City, EC 12345</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>Mon - Fri: 9AM - 6PM EST</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/courses"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  All Courses
                </a>
              </li>
              <li>
                <a
                  href="/categories/programming"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Programming
                </a>
              </li>
              <li>
                <a
                  href="/categories/design"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Design
                </a>
              </li>
              <li>
                <a
                  href="/categories/business"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Business
                </a>
              </li>
              <li>
                <a
                  href="/categories/marketing"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Marketing
                </a>
              </li>
              <li>
                <a
                  href="/categories/free"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Free Courses
                </a>
              </li>
              <li>
                <a
                  href="/bundles"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Course Bundles
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/about"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Our Team
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/become-instructor"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Become an Instructor
                </a>
              </li>
              <li>
                <a
                  href="/press"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3 text-sm mb-6">
              <li>
                <a
                  href="/help"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="/accessibility"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Accessibility
                </a>
              </li>
            </ul>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/terms"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Edubridge-LMS. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 mr-2">Follow Us:</span>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
