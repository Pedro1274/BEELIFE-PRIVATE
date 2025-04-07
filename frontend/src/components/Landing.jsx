import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../landing.css";
import "../App.css";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="landing-page">
      <img
        src="https://images.vexels.com/content/286583/preview/cute-bumblebee-ccedb0.png"
        alt="bee"
        className="bee-icon"
      />

      <section className="landing-hero">
        <h1>Bem-vindo ao BeeLife</h1>
        <p>
          Gerencie tarefas, anotações, agendas e muito mais — tudo em um só
          lugar.
        </p>
        <div className="landing-buttons">
          <button onClick={() => navigate("/login")}>Entrar</button>
          <button onClick={() => navigate("/register")}>Criar conta</button>
        </div>
      </section>

      <section className="landing-features">
        <div className="feature-card">
          <h3>Organize suas tarefas</h3>
          <p>
            Crie, edite e acompanhe o progresso de todas as suas atividades.
          </p>
        </div>
        <div className="feature-card">
          <h3>Notas rápidas</h3>
          <p>Anote ideias, lembretes e recados de forma simples e rápida.</p>
        </div>
        <div className="feature-card">
          <h3>Integração com Google Agenda</h3>
          <p>
            Visualize eventos, compromissos e deadlines com integração em tempo
            real.
          </p>
        </div>
      </section>

      <section className="landing-how-it-works">
        <h2>Como funciona?</h2>
        <div className="how-steps">
          <div>
            <h4>1. Crie sua conta</h4>
            <p>Comece seu dia com uma organização simples e rápida.</p>
          </div>
          <div>
            <h4>2. Personalize</h4>
            <p>Adicione tarefas, notas e sincronize com sua agenda.</p>
          </div>
          <div>
            <h4>3. Mantenha o foco</h4>
            <p>Visualize seu progresso e mantenha tudo sob controle.</p>
          </div>
        </div>
      </section>

      <section className="landing-testimonials">
        <h2>O que dizem sobre o BeeLife</h2>
        <div className="testimonials">
          <blockquote>
            “A melhor ferramenta de organização que já usei!”
            <br />
            <span>— Ana, estudante de medicina</span>
          </blockquote>
          <blockquote>
            “Simples, intuitivo e essencial pro meu dia.”
            <br />
            <span>— Lucas, desenvolvedor</span>
          </blockquote>
        </div>
      </section>
    </div>
  );
};

export default Landing;
