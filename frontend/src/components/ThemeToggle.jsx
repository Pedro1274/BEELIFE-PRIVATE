import React from "react";
import { ICONS } from "../assets/scripts/dashboardUtils";

const ThemeToggle = ({ isDarkMode, setIsDarkMode, hoveredIcon, setHoveredIcon }) => {
  const toggleTheme = (theme) => {
    setIsDarkMode(theme === "dark");
    localStorage.setItem("theme", theme);
  };

  return (
    <div className={`theme-toggle ${isDarkMode ? "dark-mode" : ""}`}>
      <img
        src={ICONS.LIGHT_MODE}
        alt="Light Mode Icon"
        className={`theme-icon light-mode-icon ${
          hoveredIcon === "dark" ? "hovered" : ""
        }`}
        onMouseEnter={() => setHoveredIcon("light")}
        onMouseLeave={() => setHoveredIcon(null)}
        onClick={() => toggleTheme("light")}
      />
      <img
        src={ICONS.DARK_MODE}
        alt="Dark Mode Icon"
        className={`theme-icon dark-mode-icon ${
          hoveredIcon === "light" ? "hovered" : ""
        }`}
        onMouseEnter={() => setHoveredIcon("dark")}
        onMouseLeave={() => setHoveredIcon(null)}
        onClick={() => toggleTheme("dark")}
      />
    </div>
  );
};

export default ThemeToggle;