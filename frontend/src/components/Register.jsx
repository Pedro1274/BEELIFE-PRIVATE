import React, { useState } from "react"; // Importa o hook useState do React para gerenciar estados
import { Link } from "react-router-dom"; // Importa o Link para navegação entre páginas
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirecionamento de página após login
import axios from "axios"; // Importa axios para fazer requisições HTTP
import { ICONS } from "../assets/scripts/dashboardUtils"
import "../App.css";

const Register = () => {
  // Definindo o estado do formulário, que vai armazenar os dados de usuário e senha
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });

  // Usando o hook useNavigate para redirecionamento após o registro
  const navigate = useNavigate();

  // Função para gerenciar a mudança nos campos de input (usuário e senha)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Atualiza o estado com o valor do campo alterado
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    try {
      // Envia uma requisição POST para o backend com os dados de registro (usuário e senha)
      await axios.post("http://localhost:8000/api/users/register", {
        username: formData.username,
        password: formData.password,
        email: formData.email
      });
      alert("Usuário registrado com sucesso!"); // Exibe um alerta de sucesso
      navigate("/login"); // Redireciona para a tela de login após o registro
    } catch (error) {
      console.error("Erro ao registrar", error); // Exibe o erro no console
      // Exibe um alerta com a mensagem de erro
      alert("Erro ao registrar: " + error.response?.data?.detail || error.message);
    }
  };

  // JSX que renderiza o formulário de registro
  return (
    <div className="auth-container"> {/* Contêiner principal */}
      <div className="auth-box">
        <img
          src={ICONS.BEE_LOGO}
          alt="Logo"
          className="auth-logo" 
        />
        <h2>PLANEJOU, REALIZA!</h2>
        <p className="auth-subtitle">Sua vida organizada, simplificada e inteligente</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            img={ICONS.USER_VARIANT}
            type="text" 
            name="username" 
            placeholder="Nome de Usuário" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="E-mail" 
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
          {/* <input 
            type="password" 
            name="password" 
            placeholder="Confirmar a Senha" 
            onChange={handleChange} 
            required 
          /> */}
          <button type="submit">Cadastrar</button>
        </form>
        {/* Link para a página de login caso o usuário já tenha uma conta */}
        <p className="auth-question">Já tem uma conta? <Link to="/login">Faça login</Link></p>
      </div>
    </div>
  );
};

export default Register; // Exporta o componente Register para ser usado em outros arquivos
