import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../AppTemp";
import "../App.css";
import {
  ICONS,
  MESSAGES,
  getStoredUsername,
  getStoredTheme,
} from "../assets/scripts/dashboardUtils";
import { getTasks } from "../api";
import { Pie, Line } from "react-chartjs-2";
import {
  calculateTaskCounts,
  calculateProductivityData,
  calculateUsagePatterns,
} from "../assets/scripts/dashboardUtils";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registre os componentes necessários para os gráficos
ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState(getStoredUsername());
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(14); 

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    setIsDarkMode(localStorage.getItem("theme") === "dark");
  }, [setIsDarkMode]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getTasks(token);
        console.log("Tarefas carregadas:", data);
        setTasks(data || []);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        setTasks([]);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const updateSlideWidth = () => {
      const isMobile = window.innerWidth <= 767;
      setSlideWidth(isMobile ? 15 : 14); // 100% no mobile, 14% no desktop
    };
  
    updateSlideWidth(); // roda ao montar
    window.addEventListener("resize", updateSlideWidth); // atualiza se redimensionar
  
    return () => window.removeEventListener("resize", updateSlideWidth); // limpeza
  }, []);

  // Filtra as tarefas pendentes
  const pendingTasks = tasks.filter((task) => !task.completed);

  // Ordena as tarefas pendentes por prioridade
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    const priorityOrder = { alta: 1, normal: 2, baixa: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const { completedTasks, totalTasks } = calculateTaskCounts(tasks);
  const productivityData = calculateProductivityData(tasks);
  const usagePatterns = calculateUsagePatterns(tasks);

  // Dados para o gráfico de pizza de tarefas
  const taskChartData = {
    labels: ["Tarefas Pendentes", "Tarefas Completadas", "Total de Tarefas"],
    datasets: [
      {
        data: [pendingTasks.length, completedTasks, totalTasks],
        backgroundColor: [
          "rgba(255, 215, 64, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(28, 34, 46, 0.9)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Dados para o gráfico de produtividade
  const productivityChartData = {
    labels: Object.keys(productivityData),
    datasets: [
      {
        label: "Produtividade (Tarefas Criadas)",
        data: Object.values(productivityData),
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  // Dados para o gráfico de padrões de uso
  const usagePatternChartData = {
    labels: ["Manhã", "Tarde", "Noite"],
    datasets: [
      {
        data: Object.values(usagePatterns),
        backgroundColor: [
          "rgba(255, 215, 64, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(28, 34, 46, 0.9)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    setUsername(getStoredUsername());
  }, []);

    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const theme = getStoredTheme();
    setIsDarkMode(theme === "dark");
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks(); // Chama a função getTasks
        console.log("Tarefas carregadas:", data);
        setTasks(data || []); // Atualiza o estado com as tarefas
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        setTasks([]); // Em caso de erro, define as tarefas como um array vazio
      }
    };

    loadTasks(); // Chama a função para carregar as tarefas
  }, []);

  // Define o índice máximo como 6 (7ª tarefa)
  const maxIndex = 6;

  // Função para navegação (próxima ou anterior)
  const navigateCarousel = (direction) => {
    if (direction === "next") {
      setCurrentIndex(
        (prevIndex) => Math.min(prevIndex + 1, maxIndex) // Limita o índice máximo
      );
    } else if (direction === "prev") {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  return (
    <div className="main-dashboard-container">
      <div className="dashboard-container">
        <div className={`dashboard ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`welcome-message ${isDarkMode ? "dark-mode" : ""}`}>
            <img
              src={ICONS.USER_VARIANT}
              alt="User Icon"
              className={`menu-icon-user ${isDarkMode ? "dark-mode" : ""}`}
            />
            <h1 className={`dashboardH1 ${isDarkMode ? "dark-mode" : ""}`}>
              {MESSAGES.WELCOME} {username}!
            </h1>
          </div>

          <div className="dashboard-cards">
            {/* Card de Tarefas */}
            <div className={`dashboard-card ${isDarkMode ? "dark-mode" : ""}`}>
              <h2
                className={`dashboard-cardH2 ${isDarkMode ? "dark-mode" : ""}`}
              >
                {MESSAGES.TASKS}
              </h2>
              <p className={`dashboard-cardP ${isDarkMode ? "dark-mode" : ""}`}>
                Você tem{" "}
                <strong>{pendingTasks.length} tarefas pendentes</strong>.
              </p>
            </div>

            <div className={`dashboard-card ${isDarkMode ? "dark-mode" : ""}`}>
              <h2
                className={`dashboard-cardH2 ${isDarkMode ? "dark-mode" : ""}`}
              >
                {MESSAGES.NOTES}
              </h2>
              <p className={`dashboard-cardP ${isDarkMode ? "dark-mode" : ""}`}>
                Você salvou <strong>12 anotações</strong> até agora.
              </p>
            </div>
            <div className={`dashboard-card ${isDarkMode ? "dark-mode" : ""}`}>
              <h2
                className={`dashboard-cardH2 ${isDarkMode ? "dark-mode" : ""}`}
              >
                {MESSAGES.REPORTS}
              </h2>
              <p className={`dashboard-cardP ${isDarkMode ? "dark-mode" : ""}`}>
                Seu último relatório foi atualizado há <strong>2 dias</strong>.
              </p>
            </div>
          </div>

          {/* Carrossel de Tarefas Pendentes */}
          <div
            className={`task-list-horizontal ${isDarkMode ? "dark-mode" : ""}`}
          >
            <h2 className={`task-list-header ${isDarkMode ? "dark-mode" : ""}`}>
              Tarefas Pendentes
            </h2>
            <div
              className={`task-list-container ${isDarkMode ? "dark-mode" : ""}`}
            >
              <button
                className={`carousel-button left ${
                  isDarkMode ? "dark-mode" : ""
                }`}
                onClick={() => navigateCarousel("prev")}
                disabled={currentIndex === 0}
              >
                &#8592;
              </button>

              <div
                className={`task-list ${isDarkMode ? "dark-mode" : ""}`}
                style={{
                  transform: `translateX(-${currentIndex * slideWidth}%)`,
                  transition: "transform 0.3s ease",
                }}
              >
                {sortedPendingTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`task-item ${isDarkMode ? "dark-mode" : ""}`}
                  >
                    <strong>{task.title}</strong> <br />
                    Prioridade: {task.priority} <br />
                    Vencimento:{" "}
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "Sem data"}
                  </div>
                ))}
              </div>

              <button
                className={`carousel-button right ${
                  isDarkMode ? "dark-mode" : ""
                }`}
                onClick={() => navigateCarousel("next")}
                disabled={
                  currentIndex ===
                  Math.min(sortedPendingTasks.length - 1, maxIndex)
                }
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`reports ${isDarkMode ? "dark-mode" : ""}`}>
        <h1 className={`report-cardH1 ${isDarkMode ? "dark-mode" : ""}`}>
          Relatórios
        </h1>

        <div className="dashboard-container">
          <div className="reports-cards">
            {/* Gráfico de Tarefas */}
            <div className={`report-card ${isDarkMode ? "dark-mode" : ""}`}>
              <h2 className={`report-cardH2 ${isDarkMode ? "dark-mode" : ""}`}>
                Tarefas
              </h2>
              <Pie data={taskChartData} />
            </div>

            {/* Gráfico de Produtividade */}
            <div className={`report-card ${isDarkMode ? "dark-mode" : ""}`}>
              <h2 className={`report-cardH2 ${isDarkMode ? "dark-mode" : ""}`}>
                Picos de Produtividade
              </h2>
              <Line data={productivityChartData} />
            </div>

            {/* Gráfico de Tempo Gasto 
            <div className={`report-card ${isDarkMode ? "dark-mode" : ""}`}>
              <h2>Tempo Gasto em Tarefas</h2>
              <Bar data={timeSpentChartData} />
            </div>
            */}

            {/* Gráfico de Padrões de Uso */}
            <div className={`report-card ${isDarkMode ? "dark-mode" : ""}`}>
              <h2 className={`report-cardH2 ${isDarkMode ? "dark-mode" : ""}`}>
                Padrões de Uso do Sistema
              </h2>
              <Pie data={usagePatternChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
