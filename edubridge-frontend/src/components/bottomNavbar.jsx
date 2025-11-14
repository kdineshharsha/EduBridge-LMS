import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Phone, User } from "lucide-react";

export default function BottomNavbar() {
  const navItems = [
    { to: "/", label: "Home", icon: Home, exact: true },
    { to: "/courses", label: "Explore", icon: Compass },
    { to: "/contacts", label: "Contact", icon: Phone },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full lg:hidden bg-white/70 backdrop-blur-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-t-2xl pt-1 px-2 z-50  transition-all duration-300">
      <ul className="flex justify-between items-center">
        {navItems.map(({ to, label, icon: Icon, exact }, index) => (
          <li key={index} className="flex-1 flex justify-center">
            <NavLink
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "text-transparent bg-clip-text bg-blue-500"
                    : "text-gray-500 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : "bg-white/50 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-40 -z-10"></span>
                    )}
                  </div>
                  <span className="text-[11px] mt-1 font-medium tracking-wide">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
