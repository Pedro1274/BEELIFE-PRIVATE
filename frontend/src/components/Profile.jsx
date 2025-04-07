import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importação do useNavigate
import { ThemeContext } from "../AppTemp";
import "../App.css";
import User_Variant from "../assets/icons/User_Variant.webp";
import Dark_Mode from "../assets/icons/Moon.webp";
import Light_Mode from "../assets/icons/Sun.webp";

const Dashboard = () => {
  const navigate = useNavigate(); // Hook para navegação
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Estado para armazenar o nome de usuário
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // Efeito para recuperar o nome de usuário armazenado no localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login"); // Redireciona para a página de login
  };

  // Função para alternar o tema
  const toggleTheme = (mode) => {
    setIsDarkMode(mode === "dark");
    localStorage.setItem("theme", mode);  // Salva a preferência de tema
  };

  // Efeito para carregar o tema salvo do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, [setIsDarkMode]);

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`welcome-message ${isDarkMode ? "dark-mode" : ""}`}>
        <img
          src={User_Variant}
          alt="User Icon"
          className={`menu-icon-user ${isDarkMode ? "dark-mode" : ""}`}
        />
        <h1 className={`dashboardH1 ${isDarkMode ? "dark-mode" : ""}`}>
          Seja Bem-Vindo(a) {username}!
        </h1>
        <div className={`theme-toggle ${isDarkMode ? "dark-mode" : ""}`}>
        <img
          src={Light_Mode}
          alt="Light Mode Icon"
          className={`theme-icon light-mode-icon ${hoveredIcon === "dark" ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredIcon("light")}
          onMouseLeave={() => setHoveredIcon(null)}
          onClick={() => toggleTheme("light")}
        />
        <img
          src={Dark_Mode}
          alt="Dark Mode Icon"
          className={`theme-icon dark-mode-icon ${hoveredIcon === "light" ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredIcon("dark")}
          onMouseLeave={() => setHoveredIcon(null)}
          onClick={() => toggleTheme("dark")}
        />
        </div>
      </div>

      <div className="dashboard-cards">
        <div className={`card ${isDarkMode ? "dark-mode" : ""}`}>
          <h2 className={`cardH2 ${isDarkMode ? "dark-mode" : ""}`}>📋 Tarefas</h2>
          <p className={`cardP ${isDarkMode ? "dark-mode" : ""}`}>
            Você tem <strong>5 tarefas pendentes</strong>.
          </p>
        </div>
        <div className={`card ${isDarkMode ? "dark-mode" : ""}`}>
          <h2 className={`cardH2 ${isDarkMode ? "dark-mode" : ""}`}>📝 Notas</h2>
          <p className={`cardP ${isDarkMode ? "dark-mode" : ""}`}>
            Você salvou <strong>12 anotações</strong> até agora.
          </p>
        </div>
        <div className={`card ${isDarkMode ? "dark-mode" : ""}`}>
          <h2 className={`cardH2 ${isDarkMode ? "dark-mode" : ""}`}>📊 Relatórios</h2>
          <p className={`cardP ${isDarkMode ? "dark-mode" : ""}`}>
            Seu último relatório foi atualizado há <strong>2 dias</strong>.
          </p>
        </div>
      </div>

      <button onClick={handleLogout}>Sair</button> {/* Botão de logout */}
    </div>
  );
};

export default Dashboard;
