import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../AppTemp";
import { ICONS, getStoredTheme } from "../assets/scripts/dashboardUtils";

export default function ChatComponent() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setIsDarkMode(getStoredTheme() === "dark");
  }, [setIsDarkMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "Eu", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch("http://localhost:8000/api/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }), // Alterado de 'message' para 'text'
      });
      const data = await response.json();
      const botMessage = { sender: "BeeBot", text: data.response };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }

    setInput("");
  };

  return (
    <div className={`chat-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="chat-header">
        <h1 className="chat-title">BeeBot</h1>
        <img src={ICONS.BEE_LOGO} alt="Logo" className={`bee-logo ${isDarkMode ? "dark-mode" : ""}`} />
      </div>
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="message placeholder-msg">Digite sua mensagem...</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <span className="sender">{msg.sender}:</span> {msg.text}
            </div>
          ))
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}
