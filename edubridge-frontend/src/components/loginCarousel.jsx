import React, { useEffect, useState } from "react";

export default function LoginCarousel() {
  const [current, setCurrent] = useState(0);
  const slides = ["img1.jpeg", "img2.jpeg", "img3.jpeg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${s})` }}
        ></div>
      ))}
    </div>
  );
}
