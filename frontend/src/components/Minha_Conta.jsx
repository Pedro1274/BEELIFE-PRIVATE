import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../AppTemp";
import "../App.css";
import defaultPic from "../assets/images/profile-picture-default.webp";
import { getStoredUsername } from "../assets/scripts/dashboardUtils";

export default function MinhaConta() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState({
    nome: "João Silva",
    email: "joao@email.com",
    dataCadastro: "2023-09-15",
    fotoPerfil: "",
  });
  const [username] = useState(getStoredUsername());

  useEffect(() => {
        setIsDarkMode(localStorage.getItem("theme") === "dark");
      }, [setIsDarkMode]);

  useEffect(() => {
    const imgSalva = localStorage.getItem("profilePic");
    if (imgSalva) setDados((prev) => ({ ...prev, fotoPerfil: imgSalva }));
  }, []);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setDados((prev) => ({ ...prev, fotoPerfil: base64Image }));
      };
      reader.readAsDataURL(file);
    }
  };

  const salvar = () => {
    setEditando(false);
    console.log("Dados salvos:", dados);
    localStorage.setItem("profilePic", dados.fotoPerfil); // opcional: salvar localmente
  };

  return (
    <div className={`container-conta ${isDarkMode ? "dark-mode" : ""}`}>
      <h1 className={`titulo ${isDarkMode ? "dark-mode" : ""}`}>Minha Conta</h1>

      <div className={`acc-profile-section ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="acc-profile-info">
          <img
            src={dados.fotoPerfil || defaultPic}
            alt="Foto de perfil"
            className="acc-profile-pic"
          />
          <span className={`acc-username ${isDarkMode ? "dark-mode" : ""}`}>
            {username}
          </span>
        </div>

        {editando && (
          <div className="campo">
            <label>Alterar Foto de Perfil</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        )}
      </div>

      <div className={`card ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            value={dados.nome}
            disabled={!editando}
            onChange={handleChange}
            className={isDarkMode ? "dark-mode" : ""}
          />
        </div>

        <div className="campo">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={dados.email}
            disabled={!editando}
            onChange={handleChange}
            className={isDarkMode ? "dark-mode" : ""}
          />
        </div>

        <div className="campo">
          <label>Data de Cadastro</label>
          <p className={`texto-data ${isDarkMode ? "dark-mode" : ""}`}>
            {dados.dataCadastro}
          </p>
        </div>

        <div className="botoes">
          {editando ? (
            <button
              className={`btn salvar ${isDarkMode ? "dark-mode" : ""}`}
              onClick={salvar}
            >
              Salvar
            </button>
          ) : (
            <button
              className={`btn editar ${isDarkMode ? "dark-mode" : ""}`}
              onClick={() => setEditando(true)}
            >
              Editar
            </button>
          )}
          <button className={`btn sair ${isDarkMode ? "dark-mode" : ""}`}>
            Sair
          </button>
        </div>
        
        <div className="mobile-theme-toggle">
          <button
            className={`btn toggle-theme-mobile ${
              isDarkMode ? "dark-mode" : ""
            }`}
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
            }}
          >
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
      </div>
    </div>
  );
}
