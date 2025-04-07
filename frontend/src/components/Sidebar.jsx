import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Trending_Up from "../assets/icons/Trending-Up.webp";
import Clipboard from "../assets/icons/Clipboard.webp";
import Check_Circle from "../assets/icons/Check-Circle.webp";
import SideArrow from "../assets/icons/SideArrow.webp";
import Calendar from "../assets/icons/Calendar.webp";
import User from "../assets/icons/User.webp";
import Message from "../assets/icons/Message-Circle.webp";
import MenuIcon from "../assets/icons/Menu.webp"; // ícone de hambúrguer

const menuItems = [
  <h2 key="rotina" className="menu-title">
    Rotina
  </h2>,
  {
    label: (
      <div className="menu-item">
        <img src={Check_Circle} alt="Tasks Icon" className="menu-icon" />
        Tarefas
        <img src={SideArrow} alt="Arrow Icon" className="menu-arrow" />
      </div>
    ),
    path: "/tasks",
  },
  {
    label: (
      <div className="menu-item">
        <img src={Clipboard} alt="Notes Icon" className="menu-icon" />
        Notas
        <img src={SideArrow} alt="Arrow Icon" className="menu-arrow" />
      </div>
    ),
    path: "/notes",
  },
  {
    label: (
      <div className="menu-item">
        <img src={Calendar} alt="Notes Icon" className="menu-icon" />
        Agenda
        <img src={SideArrow} alt="Arrow Icon" className="menu-arrow" />
      </div>
    ),
    path: "/agenda",
  },
  <h2 key="assistente" className="menu-title">
    Assistente
  </h2>,
  {
    label: (
      <div className="menu-item">
        <img src={Message} alt="Notes Icon" className="menu-icon" />
        Bee Bot
        <img src={SideArrow} alt="Arrow Icon" className="menu-arrow" />
      </div>
    ),
    path: "/chat",
  },
  <h2 key="perfil" className="menu-title">
    Perfil
  </h2>,
  {
    label: (
      <div className="menu-item">
        <img src={Trending_Up} alt="Reports Icon" className="menu-icon" />
        Relatórios
        <img src={SideArrow} alt="Arrow Icon" className="menu-arrow" />
      </div>
    ),
    path: "/reports",
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão mobile */}
      <button
        className="mobile-menu-button"
        onClick={() => {
          console.log("Botão clicado!");
          setIsOpen(!isOpen);
        }}
      >
        <img src={MenuIcon} alt="Menu" />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          {menuItems.map((item, index) =>
            React.isValidElement(item) ? (
              <li key={`title-${index}`}>{item}</li>
            ) : (
              <li key={item.path}>
                <Link to={item.path} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
