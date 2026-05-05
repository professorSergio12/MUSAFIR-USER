import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/useAuth";

const menuItems = [
  { label: "Profile", tab: "profile", icon: "👤" },
  { label: "My Bookings", tab: "bookings", icon: "📦" },
  { label: "Post", tab: "post", icon: "📝" },
  { label: "Gallery", tab: "gallery", icon: "📸" },
];

const SideBar = ({ onToggle }) => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleNavigate = (tab) => {
    if (tab === "profile") {
      navigate("/profile?tab=profile");
    } else if (tab === "bookings") {
      navigate("/profile?tab=bookings");
    } else if (tab === "post") {
      navigate("/profile?tab=post");
    } else if (tab === "gallery") {
      navigate("/profile?tab=gallery");
    }
  };

  return (
    <aside className="min-h-[calc(100vh-80px)] flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="px-4 sm:px-6 py-4 sm:py-6 md:py-8 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            Welcome
          </p>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
            {currentUser?.username || "Guest user"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {currentUser?.email || "guest@example.com"}
          </p>
        </div>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleNavigate(item.tab)}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer rounded-lg sm:rounded-xl text-left border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-gray-900 dark:text-white text-sm sm:text-base"
          >
            <span className="text-base sm:text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => logout()}
        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition border-t border-gray-100 dark:border-gray-700 text-sm sm:text-base cursor-pointer"
      >
        <span className="text-base sm:text-lg">↩︎</span>
        <span className="font-semibold">Log Out</span>
      </button>
    </aside>
  );
};

export default SideBar;
