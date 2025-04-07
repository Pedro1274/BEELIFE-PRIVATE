import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../AppTemp";
import { getTasks, updateTask } from "../api";
import "../App.css";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode} = useContext(ThemeContext);
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedPriority, setEditedPriority] = useState("normal");
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

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

  const handleAiSuggestion = async () => {
    setLoadingAI(true);
    const prompt = `
Tenho a seguinte tarefa:

📌 Título: ${task.title}
📝 Descrição: ${task.description || "Sem descrição fornecida"}

Com base nisso, me diga com um tom direto, útil e objetivo:

1. Qual o objetivo dessa tarefa?
2. Quais passos devo seguir para completá-la?
3. Dicas para otimizar meu tempo e produtividade com essa tarefa.

⚠️ Limite sua resposta a no máximo **13 linhas** no total.
`;

    try {
      const response = await fetch("http://localhost:8000/api/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error("Erro ao consultar IA:", error);
      setAiResponse("Erro ao gerar sugestão. Tente novamente mais tarde.");
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      try {
        const allTasks = await getTasks(token);
        const foundTask = allTasks.find((t) => t._id === id);
        setTask(foundTask);
      } catch (error) {
        console.error("Erro ao buscar tarefa:", error);
      }
    };

    fetchTask();
  }, [id]);

  const handleToggleComplete = async () => {
    const token = localStorage.getItem("token");
    try {
      await updateTask(token, task._id, {
        ...task,
        completed: !task.completed,
      });
      setTask({ ...task, completed: !task.completed });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const handleStartEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || "");
    setEditedDueDate(task.due_date ? task.due_date.slice(0, 16) : "");
    setEditedPriority(task.priority || "normal");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      const updated = {
        ...task,
        title: editedTitle,
        description: editedDescription,
        due_date: editedDueDate,
        priority: editedPriority,
      };
      await updateTask(token, task._id, updated);
      setTask(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  if (!task)
    return (
      <p className={isDarkMode ? "dark-mode" : ""}>Carregando tarefa...</p>
    );

  return (
    <div className={`task-details-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h2 className={`modal-h2 ${isDarkMode ? "dark-mode" : ""}`}>
        {task.title}
      </h2>
      <p className={`modal-h2 ${isDarkMode ? "dark-mode" : ""}`}>
        <strong>Descrição:</strong> {task.description || "Sem descrição"}
      </p>
      <p className={`modal-h2 ${isDarkMode ? "dark-mode" : ""}`}>
        <strong>Data limite:</strong>{" "}
        {task.due_date
          ? new Date(task.due_date).toLocaleString()
          : "Não definida"}
      </p>
      <p className={`modal-h2 ${isDarkMode ? "dark-mode" : ""}`}>
        <strong>Prioridade:</strong> {task.priority}
      </p>
      <p className={`modal-h2 ${isDarkMode ? "dark-mode" : ""}`}>
        <strong>Status:</strong> {task.completed ? "Concluída" : "Pendente"}
      </p>

      <div className={`task-details-buttons ${isDarkMode ? "dark-mode" : ""}`}>
        <button onClick={() => navigate(-1)}>🔙 Voltar</button>
        <button onClick={handleStartEdit}>✏️ Editar</button>
        <button onClick={handleToggleComplete}>
          {task.completed ? "Desmarcar Conclusão" : "Marcar como Concluída"}
        </button>
        <button onClick={handleAiSuggestion}>🤖 Sugestão da IA</button>
        {aiResponse && (
          <Popup
            title="🤖 Sugestão da IA"
            content={aiResponse}
            onClose={() => setAiResponse(null)}
          />
        )}
        {loadingAI && (
          <p className={`${isDarkMode ? "dark-mode" : ""}`}>
            ⌛ Consultando IA...
          </p>
        )}
      </div>

      {/* Modal de Edição */}
      {isEditing && (
        <div className={`modal ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`modal-content ${isDarkMode ? "dark-mode" : ""}`}>
            <h2 className={`modal-h2 ${isDarkMode ? "dark-mode" : ""}`}>
              Editar Tarefa
            </h2>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Título"
              className={`modal-input ${isDarkMode ? "dark-mode" : ""}`}
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Descrição"
              className={`modal-textarea ${isDarkMode ? "dark-mode" : ""}`}
            />
            <input
              type="datetime-local"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className={`modal-input ${isDarkMode ? "dark-mode" : ""}`}
            />
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className={`modal-select ${isDarkMode ? "dark-mode" : ""}`}
            >
              <option value="baixa">Baixa</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
            </select>

            <button
              onClick={handleSaveEdit}
              className={`tasks-add-button ${isDarkMode ? "dark-mode" : ""}`}
            >
              Salvar Alterações
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`tasks-close-button ${isDarkMode ? "dark-mode" : ""}`}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
