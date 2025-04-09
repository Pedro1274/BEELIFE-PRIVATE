import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../AppTemp";
import { Pie, Line } from "react-chartjs-2";
import {
  calculateTaskCounts,
  calculateProductivityData,
  calculateUsagePatterns,
} from "../assets/scripts/dashboardUtils";
import { getTasks } from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import PadroesAvisos from "./PadroesAvisos";

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

const Reports = () => {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [dashboardData, setDashboardData] = useState({
    dias_frequentes: [],
    prioridades_frequentes: [],
    tarefas_prioritarias: [],
  });
  const [tasks, setTasks] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line 
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    setIsDarkMode(localStorage.getItem("theme") === "dark");
  }, [setIsDarkMode]);

    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line 
  useEffect(() => {
    const loadTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado, redirecionando...");
        navigate("/login");
        return;
      }

      try {
        const data = await getTasks(token);
        setTasks(data);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    };

    const fetchDashboardData = async () => {
      const data = {
        dias_frequentes: [
          { dia: "Sunday", frequencia: 2 },
          { dia: "Monday", frequencia: 1 },
          { dia: "Data inválida", frequencia: 2 },
        ],
        prioridades_frequentes: [
          { prioridade: "normal", frequencia: 5 },
          { prioridade: "baixa", frequencia: 2 },
          { prioridade: "alta", frequencia: 1 },
        ],
        tarefas_prioritarias: [
          { tarefa: "Ixe maria painho, arre egua", frequencia: 1 },
          { tarefa: "Ave maria doido", frequencia: 1 },
          { tarefa: "AAAAAAAAAAAA", frequencia: 1 },
        ],
      };
      setDashboardData(data);
    };

    loadTasks();
    fetchDashboardData();
  // eslint-disable-next-line
}, []);

  const { pendingTasks, completedTasks, totalTasks } =
    calculateTaskCounts(tasks);
  const productivityData = calculateProductivityData(tasks);
  const usagePatterns = calculateUsagePatterns(tasks);

  // Dados para o gráfico de pizza de tarefas
  const taskChartData = {
    labels: ["Tarefas Pendentes", "Tarefas Completadas", "Total de Tarefas"],
    datasets: [
      {
        data: [pendingTasks, completedTasks, totalTasks],
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

  return (
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
        <div style={{ marginTop: "2rem" }}>
          <PadroesAvisos />
        </div>
      </div>
    </div>
  );
};

export default Reports;
