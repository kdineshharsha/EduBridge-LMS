import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/contact",
        formData
      );

      toast.success("Message sent successfully!");
      setSubmitted(true);

      // reset form after success
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // hide success message UI after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again later.");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Touch
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Have questions about Edu-Bridge? We're here to help. Reach out to
              us and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* LEFT SIDE INFO CARDS */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-blue-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 size-12 md:size-14 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Email Us
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  Send us an email anytime
                </p>
                <a
                  href="mailto:support@edubridge.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@edubridge.com
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-purple-100">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 size-12 md:size-14 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Call Us
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  Mon-Fri from 9am to 6pm
                </p>
                <a
                  href="tel:+1234567890"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  +1 (234) 567-890
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-blue-100">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 size-12 md:size-14 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Visit Us
                </h3>
                <p className="text-gray-600 text-sm mb-1">Come say hello</p>
                <p className="text-gray-700">
                  123 Learning Street <br />
                  Education City, EC 12345
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <Clock className="mb-3" size={28} />
                <h3 className="text-xl font-semibold mb-1">Business Hours</h3>
                <div className="space-y-1 text-sm">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-100">
                <div className="flex items-center mb-6">
                  <MessageSquare className="text-blue-600 mr-3" size={32} />
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Send us a Message
                  </h3>
                </div>

                {/* Success Message */}
                {submitted ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-8 text-center">
                    <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="text-white" size={28} />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">
                      Message Sent!
                    </h4>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you
                      shortly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition"
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none transition"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition"
                        placeholder="How can we help you?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none transition resize-none"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
                        loading ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12 lg:mb-0 mb-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Edu-Bridge. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Empowering education through technology
          </p>
        </div>
      </footer>
    </div>
  );
}
