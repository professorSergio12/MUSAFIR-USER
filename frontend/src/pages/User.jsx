import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import UserProfile from "./UserProfile";
import SideBar from "../components/SideBar";
import UserPost from "../components/UserPost";
import UserPersonalGallery from "../components/UserPersonalGallery";
const User = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab("profile");
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {showSidebar && (
        <div className="w-full md:w-64 lg:w-72 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 shadow-sm flex-shrink-0">
          <SideBar onToggle={() => setShowSidebar(false)} />
        </div>
      )}
      <div className="flex-1 bg-white dark:bg-gray-900 w-full overflow-x-hidden min-w-0">
        {/* Sidebar toggle button - when sidebar is hidden */}
        {!showSidebar && (
          <div className="px-4 pt-4 md:px-6 md:pt-6 flex justify-start">
            <button
              type="button"
              onClick={() => setShowSidebar(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <span className="text-lg">▸</span>
              <span>Show Menu</span>
            </button>
          </div>
        )}

        {tab === "profile" && <UserProfile />}
        {tab === "bookings" && <Dashboard />}
        {tab === "dashboard" && <Dashboard />}
        {tab === "post" && <UserPost />}
        {tab === "gallery" && <UserPersonalGallery />}
      </div>
    </div>
  );
};

export default User;
