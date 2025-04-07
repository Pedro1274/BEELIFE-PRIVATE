import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../AppTemp";
import { getTasks, createTask, deleteTask, updateTask } from "../api"; // Funções da API
import "../App.css";
import { ICONS, getStoredTheme } from "../assets/scripts/dashboardUtils";

const Tasks = () => {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("normal");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingtaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal

  useEffect(() => {
    setIsDarkMode(getStoredTheme() === "dark");
  }, [setIsDarkMode]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line 
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const data = await getTasks(token);
        setTasks(data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks(); // Adicionado a chamada da função 
  // eslint-disable-next-line 
  }, [navigate]); // Adicionado navigate como dependência

  // Função para salvar uma tarefa
  const handleSaveTask = async () => {
    const token = localStorage.getItem("token");
    const taskData = {
      title: newTaskTitle,
      description: newTaskDescription,
      due_date: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
      priority: newTaskPriority,
      completed: false,
      category: "tarefa",
    };

    try {
      if (isEditing && editingTaskId) {
        await updateTask(token, editingTaskId, taskData);
      } else {
        await createTask(token, taskData);
      }

      const updatedTask = await getTasks(token);
      setTasks(updatedTask);

      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setNewTaskPriority("normal");
      setIsEditing(false);
      setEditingtaskId(null);
      setIsModalOpen(false); // Fecha o modal após salvar a tarefa
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  // Função de editar uma tarefa
  const handleEditTask = (task) => {
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description || "");
    setNewTaskDueDate(task.due_date ? task.due_date.substring(0, 16) : "");
    setNewTaskPriority(task.priority || "normal");
    setIsEditing(true);
    setEditingtaskId(task._id);
    setIsModalOpen(true); // Abre o modal para edição
  };

  // Função de criar uma nova tarefa (limpa os campos)
  const handleCreateNewTask = () => {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setNewTaskPriority("normal");
    setIsEditing(false); // Assegura que o estado de edição esteja desativado
    setIsModalOpen(true); // Abre o modal para criação
  };

  // Função para deletar uma tarefa
  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      console.error("Erro: ID da tarefa está indefinido.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await deleteTask(token, taskId); // Adicionado o token como argumento
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove a tarefa da lista localmente
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  // Função para marcar tarefa como concluído
  const handleToggleComplete = async (task) => {
    const token = localStorage.getItem("token");

    try {
      const updatedTask = {
        ...task,
        completed: !task.completed, // inverte o estado atual
      };

      await updateTask(token, task._id, updatedTask); // atualiza no backend

      // Atualiza localmente no frontend
      const updatedTasks = tasks.map((t) =>
        t._id === task._id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Erro ao marcar tarefa como concluída:", error);
    }
  };

  // Função para atualizar a ordem das tarefas
  const updateTaskOrder = async (token, updatedTasks) => {
    try {
      // Implementação básica - na API real seria necessário um endpoint específico
      // Este é apenas um placeholder, você precisará implementar a API adequada
      console.log("Atualizando ordem das tarefas...");
      
      // Simulação de atualização bem-sucedida
      return true;
    } catch (error) {
      console.error("Erro ao atualizar ordem das tarefas:", error);
      return false;
    }
  };

  // Função para mover uma tarefa para cima dentro do mesmo grupo de prioridade
  const handleMoveUp = async (index, sortedTasks) => {
    try {
      const token = localStorage.getItem("token");
      const currentTask = sortedTasks[index];
      
      // Encontrar o índice da primeira tarefa no grupo com a mesma prioridade
      let firstIndexInPriorityGroup = index;
      while (firstIndexInPriorityGroup > 0 && 
             sortedTasks[firstIndexInPriorityGroup - 1].priority === currentTask.priority) {
        firstIndexInPriorityGroup--;
      }
      
      // Se a tarefa já for a primeira do grupo, não faz nada
      if (index === firstIndexInPriorityGroup) {
        return;
      }
      
      // Criar um novo array com a ordem atualizada
      const newTasks = [...tasks];
      const taskToMoveUp = newTasks.findIndex(t => t._id === currentTask._id);
      const taskAbove = newTasks.findIndex(t => t._id === sortedTasks[index - 1]._id);
      
      // Trocar as posições
      [newTasks[taskToMoveUp], newTasks[taskAbove]] = [newTasks[taskAbove], newTasks[taskToMoveUp]];
      
      // Atualizar o estado e possivelmente o backend
      await updateTaskOrder(token, newTasks);
      setTasks(newTasks);
    } catch (error) {
      console.error("Erro ao mover tarefa para cima:", error);
    }
  };

  // Função para mover uma tarefa para baixo dentro do mesmo grupo de prioridade
  const handleMoveDown = async (index, sortedTasks) => {
    try {
      const token = localStorage.getItem("token");
      const currentTask = sortedTasks[index];
      
      // Encontrar o índice da última tarefa no grupo com a mesma prioridade
      let lastIndexInPriorityGroup = index;
      while (lastIndexInPriorityGroup < sortedTasks.length - 1 && 
             sortedTasks[lastIndexInPriorityGroup + 1].priority === currentTask.priority) {
        lastIndexInPriorityGroup++;
      }
      
      // Se a tarefa já for a última do grupo, não faz nada
      if (index === lastIndexInPriorityGroup) {
        return;
      }
      
      // Criar um novo array com a ordem atualizada
      const newTasks = [...tasks];
      const taskToMoveDown = newTasks.findIndex(t => t._id === currentTask._id);
      const taskBelow = newTasks.findIndex(t => t._id === sortedTasks[index + 1]._id);
      
      // Trocar as posições
      [newTasks[taskToMoveDown], newTasks[taskBelow]] = [newTasks[taskBelow], newTasks[taskToMoveDown]];
      
      // Atualizar o estado e possivelmente o backend
      await updateTaskOrder(token, newTasks);
      setTasks(newTasks);
    } catch (error) {
      console.error("Erro ao mover tarefa para baixo:", error);
    }
  };

  // Ordenar tarefas por prioridade
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { alta: 1, normal: 2, baixa: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className={`tasks-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h1 className={`tasks-title ${isDarkMode ? "dark-mode" : ""}`}>
        📋 Minhas Tarefas
      </h1>

      {/* Botão de criar tarefa */}
      <button
        className={`tasks-create-button ${isDarkMode ? "dark-mode" : ""}`}
        onClick={handleCreateNewTask}
      >
        Criar Tarefa
      </button>

      {/* Modal de Criação de Tarefa */}
      {isModalOpen && (
        <div className={`modal ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`modal-content ${isDarkMode ? "dark-mode" : ""}`}>
            <h2 className={`modal-h2 ${isDarkMode ? "dark-mode" : ""}`}>
              {isEditing ? "Editar Tarefa" : "Criar Tarefa"}
            </h2>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              className={`modal-input ${isDarkMode ? "dark-mode" : ""}`}
            />
            <textarea
              placeholder="Descrição da tarefa"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className={`modal-textarea ${isDarkMode ? "dark-mode" : ""}`}
            />
            <input
              type="datetime-local"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className={`modal-input ${isDarkMode ? "dark-mode" : ""}`}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className={`modal-select ${isDarkMode ? "dark-mode" : ""}`}
            >
              <option
                value="baixa"
                className={`modal-select-option ${
                  isDarkMode ? "dark-mode" : ""
                }`}
              >
                Baixa
              </option>
              <option
                value="normal"
                className={`modal-select-option ${
                  isDarkMode ? "dark-mode" : ""
                }`}
              >
                Normal
              </option>
              <option
                value="alta"
                className={`modal-select-option ${
                  isDarkMode ? "dark-mode" : ""
                }`}
              >
                Alta
              </option>
            </select>

            <button
              className={`tasks-add-button ${isDarkMode ? "dark-mode" : ""}`}
              onClick={handleSaveTask}
            >
              {isEditing ? "Atualizar" : "Adicionar"}
            </button>

            <button
              className={`tasks-close-button ${isDarkMode ? "dark-mode" : ""}`}
              onClick={() => setIsModalOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <ul className={`tasks-list ${isDarkMode ? "dark-mode" : ""}`}>
        {sortedTasks.map((task, index) => {
          // Verificar se pode mover para cima (está dentro do mesmo grupo de prioridade e não é o primeiro)
          const canMoveUp =
            index > 0 && task.priority === sortedTasks[index - 1].priority;
          
          // Verificar se pode mover para baixo (está dentro do mesmo grupo de prioridade e não é o último)
          const canMoveDown =
            index < sortedTasks.length - 1 &&
            task.priority === sortedTasks[index + 1].priority;

          return (
            <li
              className={`tasks-item ${isDarkMode ? "dark-mode" : ""}`}
              key={task._id}
            >
              <label
                className={`tasks-checkbox ${isDarkMode ? "dark-mode" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  className={isDarkMode ? "dark-mode" : ""}
                />
                <span
                  onClick={() => navigate(`/tarefa/${task._id}`)}
                  style={{
                    cursor: "pointer",
                    textDecoration: task.completed ? "line-through" : "none",
                    color: isDarkMode ? "#ffffff" : "#000000",
                  }}
                  title={task.title}
                >
                  {task.title.length > 30
                    ? `${task.title.substring(0, 30)}...`
                    : task.title}
                </span>
              </label>

              <div
                className={`tasks-buttons-config ${
                  isDarkMode ? "dark-mode" : ""
                }`}
              >
                <div
                  className={`task-move-buttons ${
                    isDarkMode ? "dark-mode" : ""
                  }`}
                >
                  <button
                    className={`tasks-arrow-button ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    onClick={() => canMoveUp && handleMoveUp(index, sortedTasks)}
                    disabled={!canMoveUp}
                  >
                    <img src={ICONS.UP_ARROW} alt="seta para cima" />
                  </button>
                  <button
                    className={`tasks-arrow-button ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    onClick={() => canMoveDown && handleMoveDown(index, sortedTasks)}
                    disabled={!canMoveDown}
                  >
                    <img src={ICONS.DOWN_ARROW} alt="seta para baixo" />
                  </button>
                </div>
                <button
                  className={`menu-item tasks-delete-button ${
                    isDarkMode ? "dark-mode" : ""
                  }`}
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <img
                    src={ICONS.LIXEIRA}
                    alt="Excluir"
                    className={`menu-icon ${isDarkMode ? "dark-mode" : ""}`}
                  />
                </button>
                <button
                  className={`menu-item tasks-edit-button ${
                    isDarkMode ? "dark-mode" : ""
                  }`}
                  onClick={() => handleEditTask(task)} // Edita a tarefa ao clicar
                >
                  <img
                    src={ICONS.EDIT_ICON}
                    alt="Editar"
                    className={`menu-icon ${isDarkMode ? "dark-mode" : ""}`}
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tasks;