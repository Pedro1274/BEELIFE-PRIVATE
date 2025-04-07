import React, { useState } from "react"; // Importa o React e useState para gerenciar o estado do componente
import { Link, useNavigate } from "react-router-dom"; // Importa o Link para navegação entre páginas
import axios from "axios"; // Importa axios para fazer requisições HTTP
import { ICONS } from "../assets/scripts/dashboardUtils";
import { signInWithGoogle } from "../firebaseConfig";
import GoogleIcon from "../assets/icons/google-icon.webp"
import "../App.css";

const Login = () => {
  // Estado para armazenar os dados do formulário de login
  const [formData, setFormData] = useState({ login: "", password: "" });
  
  // Hook para navegação após o login
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const googleUser = await signInWithGoogle(); // agora retorna um objeto com { token, displayName, email... }
      if (!googleUser?.token) return alert("Erro ao autenticar com o Google!");
  
      const response = await axios.post(
        "https://beelife-private.onrender.com/api/users/google-login",
        { token: googleUser.token }, // envia apenas o token para o back-end
        { headers: { "Content-Type": "application/json" } }
      );
  
      // Armazena o token e outros dados, se quiser
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("username", googleUser.displayName); // opcional
  
      navigate("/"); // redireciona após login
    } catch (error) {
      console.error("Erro ao fazer login com Google", error);
      alert("Erro ao fazer login com Google: " + (error.response?.data?.detail || error.message));
    }
  };  

  // Função que lida com a mudança nos campos de entrada
  const handleChange = (e) => {
    // Atualiza o estado 'formData' com o valor do campo modificado
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função que lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    try {
      // Faz a requisição de login usando a API
      const response = await axios.post("https://beelife-private.onrender.com/api/users/login", formData);
  
      // Salva o token e o username no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username); // Agora, o username está sendo salvo corretamente
  
      navigate("/"); // Redireciona para a página principal
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.detail || "Erro desconhecido no login.";
        alert(`Erro ao fazer login: ${errorMessage}`);
      } else {
        alert(`Erro ao fazer login: ${error.message}`);
      }      
    }
  };  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img
          src={ICONS.BEE_LOGO}
          alt="Logo"
          className="auth-logo" 
        />
        <h2>PLANEJOU, REALIZOU!</h2>
        <p className="auth-subtitle">Sua vida organizada, simplificada e inteligente</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            img={ICONS.USER_VARIANT}
            type="text" 
            name="login" 
            placeholder="E-mail ou Usuário" 
            onChange={handleChange} 
            required 
          />
          <input 
            img={ICONS.PASSWORD}
            type="password" 
            name="password" 
            placeholder="Senha do Usuário" 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Entrar</button>
        </form>
        <button onClick={handleGoogleLogin} className="button_google">Entrar com o Google <img src={GoogleIcon} alt="logo do google" /></button>
        <p className="auth-question">Ainda não tem conta? <Link to="/register">Cadastre-se</Link></p>
      </div>
    </div>
  );
};

export default Login;
