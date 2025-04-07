import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ThemeContext } from "../AppTemp";
import "../PadroesAvisos.css";

const PadroesAvisos = () => {
  const [padroes, setPadroes] = useState(null);
  const [avisos, setAvisos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sections, setSections] = useState([]);
  const [activePopup, setActivePopup] = useState(-1);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [loadingBeeBot, setLoadingBeeBot] = useState(false);

  const Popup = ({ title, content, onClose }) => (
    <div className={`popup ${isDarkMode ? "dark-mode" : ""}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h4>{title}</h4>
        <button onClick={onClose}>✖</button>
      </div>
      <p>{content}</p>
    </div>
  );

  useEffect(() => {
    setIsDarkMode(localStorage.getItem("theme") === "dark");
  }, [setIsDarkMode]);

  useEffect(() => {
    axios
      .get("https://beelife-private.onrender.com/api/patterns/padroes")
      .then((response) => {
        console.log("📦 Dados recebidos:", response.data);
        setPadroes(response.data);
      })
      .catch((error) => console.error("Erro ao buscar padrões:", error));

    axios
      .get("https://beelife-private.onrender.com/api/patterns/avisos")
      .then((response) => {
        // Verifica se a resposta tem a estrutura esperada
        const avisosData =
          response.data?.avisos ||
          response.data?.warnings ||
          (Array.isArray(response.data) ? response.data : []);
        setAvisos(avisosData);
      })
      .catch((error) => {
        console.error("Erro ao buscar avisos:", error);
        setAvisos([]); // Garante que avisos seja um array vazio em caso de erro
      });
  }, []);

  const sendMessage = async () => {
    if (!padroes) return console.error("Padrões não carregados ainda.");
    setLoadingBeeBot(true);

    const prompt = `
Aqui estão os padrões de comportamento do usuário:
- Tarefas prioritárias: ${
      padroes?.tarefas_prioritarias?.map((t) => t.tarefa).join(", ") ||
      "Nenhuma"
    }
- Dias mais frequentes: ${
      padroes?.dias_frequentes
        ?.map((d) => `${d.dia} (${d.frequencia} vezes)`)
        .join(", ") || "Nenhum"
    }
- Prioridades mais usadas: ${
      padroes?.prioridades_frequentes
        ?.map((p) => `${p.prioridade} (${p.frequencia} tarefas)`)
        .join(", ") || "Nenhum"
    }
- Tarefas atrasadas: ${
      padroes?.tarefas_atrasadas?.map((t) => t.tarefa).join(", ") || "Nenhuma"
    }

E os seguintes avisos personalizados:
${avisos.length > 0 ? avisos.join("\n") : "Nenhum aviso necessário."}

Com base nisso, gere uma análise e sugestões para otimização do tempo do usuário, com o seguinte formato:

🔹 0. RESUMO GERAL:
Faça um resumo de no máximo **5 linhas** destacando os principais problemas e o objetivo da melhoria de rotina.

🔹 1. [TÍTULO]
- Problema: [resuma em 1 frase]
- Solução: [resuma em até 3 frases com tom direto e prático]

🔹 2. [TÍTULO]
- Problema: ...
- Solução: ...

(E assim por diante até o tópico 6, sempre com essa estrutura.)

⚠️ Mantenha as marcações "🔹" para cada seção para facilitar o parse.
`;

    const userMessage = { sender: "Eu", text: prompt };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:8000/api/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });

      const data = await response.json();
      const botMessage = { sender: "BeeBot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);

      const rawSections = data.response.split("🔹").slice(1);
      const parsed = rawSections.map((sec) => {
        const [titleLine, ...rest] = sec.split("\n");
        return {
          title: titleLine.trim(),
          content: rest.join("\n").trim(),
        };
      });

      setSections(parsed);
      setActivePopup(0);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setLoadingBeeBot(false); // <- Finaliza o loading
    }
  };

  return (
    <div className={`container ${isDarkMode ? "dark-mode" : ""}`}>
      <h1 className={`report-cardH1 ${isDarkMode ? "dark-mode" : ""}`}>
        📊 Análise de Padrões
      </h1>

      {padroes ? (
        <div
          className={`grid-padroes ${isDarkMode ? "dark-mode" : ""}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          <div className={`padrao-bloco ${isDarkMode ? "dark-mode" : ""}`}>
            <h3>🔝 Tarefas Prioritárias:</h3>
            <ul>
              {padroes.tarefas_prioritarias.map((t, i) => (
                <li key={i}>📌 {t.tarefa}</li>
              ))}
            </ul>
          </div>

          <div className={`padrao-bloco ${isDarkMode ? "dark-mode" : ""}`}>
            <h3>⏰ Frequência de prioridades:</h3>
            <ul>
              {padroes.prioridades_frequentes.map((p, i) => (
                <li key={i}>
                  🔥 {p.prioridade}: {p.frequencia} tarefas criadas
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className={isDarkMode ? "dark-mode" : ""}>Carregando padrões...</p>
      )}

      <h1
        className={`report-cardH1 ${isDarkMode ? "dark-mode" : ""}`}
        style={{ marginTop: "2rem" }}
      >
        🛎️ Avisos
      </h1>
      <div className={`avisos ${isDarkMode ? "dark-mode" : ""}`}>
        {avisos && avisos.length > 0 ? (
          <ul className="avisos-list">
            {avisos.map((aviso, index) => (
              <li key={index} className="aviso-item">
                ⚠️{" "}
                {typeof aviso === "object"
                  ? aviso.message || aviso.text
                  : aviso}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-avisos">✅ Nenhum aviso necessário!</p>
        )}
      </div>

      <button
        className={`botao-enviar ${isDarkMode ? "dark-mode" : ""}`}
        onClick={sendMessage}
        disabled={loadingBeeBot}
      >
        {loadingBeeBot ? "⏳ Consultando BeeBot..." : "📡 Consultar BeeBot"}
      </button>

      {sections[activePopup] && (
        <Popup
          title={`🔹 ${activePopup + 1}. ${sections[activePopup].title}`}
          content={sections[activePopup].content}
          onClose={() => setActivePopup((prev) => prev + 1)}
        />
      )}
    </div>
  );
};

export default PadroesAvisos;
