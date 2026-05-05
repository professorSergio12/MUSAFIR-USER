import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "flowbite-react";
import { toggleTheme } from "../redux/theme/themeSlice.js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: logout } = useLogout();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/all-packages" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/about" },
  ];

  // Check if a nav item is active
  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-2xl sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-wide">
              <span className="text-orange-500">M</span>
              <span className="text-gray-900 dark:text-white">USAFIR</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-2 xl:px-4 py-2 text-base xl:text-lg font-semibold transition-colors duration-300 relative ${
                    active
                      ? "text-orange-500"
                      : "text-gray-900 dark:text-white hover:text-red-500"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  ></span>
                </Link>
              );
            })}
            {/* <button
              onClick={() => dispatch(toggleTheme())}
              className="flex items-center justify-center w-12 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FaSun className="text-xl text-yellow-500" />
              ) : (
                <FaMoon className="text-xl text-blue-500" />
              )}
            </button> */}

            {!currentUser && (
              <Link
                to="/signin"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300 hover:scale-105 transform cursor-pointer"
              >
                Sign In
              </Link>
            )}

            {currentUser && (
              <div className="flex items-center space-x-4">
                {/* Avatar Button */}
                <button
                  onClick={() => navigate("/profile?tab=profile")}
                  className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 cursor-pointer cursor-pointer"
                >
                  {currentUser.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-orange-500 font-bold">
                      {currentUser.username?.charAt(0).toUpperCase() ||
                        currentUser.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-300 hover:scale-105 transform cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FaSun className="text-lg text-yellow-500" />
              ) : (
                <FaMoon className="text-lg text-blue-500" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-white hover:text-orange-500 p-2 focus:outline-none cursor-pointer"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-md text-lg font-semibold transition-colors duration-300 relative ${
                    active
                      ? "text-orange-500 bg-orange-500/10 border-l-4 border-orange-500"
                      : "text-gray-900 dark:text-white hover:text-orange-500 hover:bg-orange-500/10"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* If NOT logged in */}
            {!currentUser && (
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-md text-lg text-center block"
              >
                Sign In
              </Link>
            )}

            {/* If logged in */}
            {currentUser && (
              <>
                <button
                  onClick={() => {
                    navigate("/profile?tab=profile");
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-lg text-gray-900 dark:text-white cursor-pointer"
                >
                  {currentUser.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentUser.username?.charAt(0).toUpperCase() ||
                          currentUser.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{currentUser.username || currentUser.name}</span>
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-md text-lg w-full cursor-pointer"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
