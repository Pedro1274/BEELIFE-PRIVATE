import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { ThemeContext } from "../AppTemp";
import ThemeToggle from "./ThemeToggle";
import "../App.css";
import { ICONS, handleLogout } from "../assets/scripts/dashboardUtils";
import { getStoredUsername } from "../assets/scripts/dashboardUtils"; // Deixa só o username aqui
import defaultPic from "../assets/images/profile-picture-default.webp"; // Usa a imagem padrão local

const Header = () => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username] = useState(getStoredUsername());
  const [profilePic, setProfilePic] = useState("");
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/">
          <img src={ICONS.WHITE_BEE_LOGO} alt="Bee Life Logo" className="bee-logo" />
          Bee Life
        </Link>
      </h1>

      <div className="profile-section">
        <div className="profile-info" onClick={toggleDropdown}>
          <img
            src={profilePic || defaultPic}
            alt="Profile"
            className="profile-pic"
          />
          <span className="username">{username}</span>
        </div>

        <ThemeToggle
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          hoveredIcon={hoveredIcon}
          setHoveredIcon={setHoveredIcon}
        />

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/conta" className="dropdown-item">
              Meu Perfil
            </Link>
            <button onClick={handleLogoutClick} className="dropdown-item">
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;