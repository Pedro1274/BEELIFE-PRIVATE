import { createContext, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./components/Landing";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Reports from "./components/Reports";
import PadroesAvisos from "./components/PadroesAvisos";
import Login from "./components/Login";
import Register from "./components/Register";
import Conta from "./components/Minha_Conta";
import TaskDetails from "./components/Detalhes_Task";
import GoogleCalendar from "./components/GoogleCalendar";
import ChatBot from "./components/ChatBot";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

// Criar um contexto para o modo escuro
export const ThemeContext = createContext();

function App() {
  const location = useLocation();

  // Verifica se a página atual é simples (sem sidebar e header)
  const isSimplePage = ["/", "/login", "/register"].includes(location.pathname);

  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <div className={`app-container ${isSimplePage ? "simple-page" : ""} ${isDarkMode ? "dark-mode" : ""}`}>
        {!isSimplePage && <Sidebar />}
        <div className="main-content">
          {!isSimplePage && <Header />}
          <div className="content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/agenda" element={<PrivateRoute element={<GoogleCalendar />} />} />
              <Route path="/conta" element={<PrivateRoute element={<Conta />} />} />
              <Route path="/tasks" element={<PrivateRoute element={<Tasks />} />} />
              <Route path="/tarefa/:id" element={<PrivateRoute element={<TaskDetails />} />} />
              <Route path="/profile" element={<PrivateRoute element={<Tasks />} />} />
              <Route path="/padroes" element={<PrivateRoute element={<PadroesAvisos />} />} />
              <Route path="/chat" element={<PrivateRoute element={<ChatBot />} />} />
              <Route path="/notes" element={<PrivateRoute element={<Notes />} />} />
              <Route path="/reports" element={<PrivateRoute element={<Reports />} />} />
            </Routes>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
