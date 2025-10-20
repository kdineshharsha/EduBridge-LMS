import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function TopNavbar() {
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/contacts", label: "Contact Us" },
    { to: "/about", label: "About Us" },
  ];

  return (
    <header className="w-full  h-16 flex p-4 bg-white  items-center justify-around sticky ">
      <div className="">
        <img src="/logo_sm.png" alt="" className="h-10" />
      </div>
      <nav className="hidden md:flex space-x-4">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition-all duration-200 trasform hover:scale-102 ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/instructor")}
          className="px-4 py-2 text-white bg-red-500 rounded"
        >
          Instructor Dashboard
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 outline-0s ring-blue-500 ring-1 rounded"
        >
          Register
        </button>
      </div>
    </header>
  );
}
