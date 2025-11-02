import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, BookOpen, Settings } from "lucide-react";

export default function TopNavbar() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/contacts", label: "Contact Us" },
    { to: "/about", label: "About Us" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0  cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/logo_sm.png" alt="Logo" className="h-8 sm:h-10 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Instructor Dashboard */}
            {user?.role === "instructor" && (
              <button
                onClick={() => navigate("/instructor")}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                Instructor Dashboard
              </button>
            )}

            {/* Auth Buttons */}
            {!user || !token ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition-all duration-200 hover:border-gray-400"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-700 shadow-md hover:shadow-lg"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                {/* Avatar */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="size-10 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold text-sm focus:outline-none"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {user.firstName?.charAt(0).toUpperCase()}
                      {user.lastName?.charAt(0).toUpperCase()}
                    </>
                  )}
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50">
                    {/* User Info Header */}
                    <div className="px-4 pb-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col mt-1">
                      {[
                        {
                          label: "My Profile",
                          icon: User,
                          action: () => navigate("/profile"),
                        },
                        {
                          label: "My Courses",
                          icon: BookOpen,
                          action: () => navigate("/my-courses"),
                        },
                        {
                          label: "Settings",
                          icon: Settings,
                          action: () => navigate("/settings"),
                        },
                      ].map(({ label, icon: Icon, action }, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            action();
                            setMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-150 rounded-md"
                        >
                          <Icon className="w-4 h-4 text-gray-500" />
                          {label}
                        </button>
                      ))}

                      <hr className="my-1 border-gray-200" />

                      {/* Logout */}
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          navigate("/");
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 rounded-md"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
