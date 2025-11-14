import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const feedbacks = [
  {
    name: "Amesha Silva",
    role: "Software Engineering Student",
    feedback:
      "This LMS completely changed the way I learn. The UI is clean, fast, and feels incredibly modern.",
    image: "https://i.postimg.cc/3N1Cqbyd/user1.jpg",
    rating: 5,
  },
  {
    name: "Ravindu Perera",
    role: "Full Stack Developer",
    feedback:
      "My favorite part is the smooth video player and progress tracking. Everything works flawlessly!",
    image: "https://i.postimg.cc/fT2B7dS4/user2.jpg",
    rating: 4,
  },
  {
    name: "Nethmi Rajapaksha",
    role: "UI/UX Designer",
    feedback:
      "Stunning design and the experience feels premium. Definitely one of the best LMS platforms!",
    image: "https://i.postimg.cc/6qKJ0spG/user3.jpg",
    rating: 5,
  },
];

export default function FeedbackCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % feedbacks.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 ">
      {/* Header */}
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">
        What Our Students Say
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Trusted by Thousands
        </span>
      </h2>

      <div className="relative bg-white p-8 rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Slide Container */}
        <div
          className="flex transition-all duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {feedbacks.map((item, i) => (
            <div
              key={i}
              className="min-w-full flex flex-col items-center text-center px-6"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-full object-cover shadow-md mb-4"
              />

              {/* Name */}
              <h3 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{item.role}</p>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(item.rating)].map((_, r) => (
                  <Star
                    key={r}
                    size={20}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
                “{item.feedback}”
              </p>
            </div>
          ))}
        </div>

        {/* Left Button */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full hover:bg-gray-50 transition"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Button */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full hover:bg-gray-50 transition"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-3 mt-6">
        {feedbacks.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === i
                ? "bg-gradient-to-r from-blue-600 to-purple-600 w-6"
                : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
