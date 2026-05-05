import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ThemeProvider = ({ children }) => {
  // Get theme from Redux store (default to "light" if not set)
  const { theme } = useSelector((state) => state.theme);
  const currentTheme = theme || "light";

  // Apply theme to HTML element
  useEffect(() => {
    const htmlElement = document.documentElement;

    // Always remove dark class first
    htmlElement.classList.remove("dark");

    // Add dark class only if theme is "dark"
    if (currentTheme === "dark") {
      htmlElement.classList.add("dark");
    }
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      {children}
    </div>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
