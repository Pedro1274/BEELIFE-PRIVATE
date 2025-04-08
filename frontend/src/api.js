import axios from "axios";

const API_URL = "https://beelife-private.onrender.com/api";

// Função para registrar usuário
export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, { username, password });
        return response.data;
    } catch (error) {
        console.error("Erro ao registrar:", error.response?.data || error.message);
        throw error;
    }
};

// Função para login de usuário
export const loginUser = async (login, password, navigate) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, { login, password });
        const { token, username, email } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        navigate("/dashboard"); // Redireciona usando useNavigate
    } catch (error) {
        console.log("Erro na resposta da API:", error.response?.data);
        console.log("Erro completo:", error);

        if (error.response && error.response.data) {
            alert(`Erro ao fazer login: ${JSON.stringify(error.response.data)}`);
        } else {
            alert(`Erro ao fazer login: ${error.message}`);
        }
    }
};

// 🚀 **Função para login com Google**
export const googleLogin = async (token) => {
    try {
        const response = await axios.post(`${API_URL}/users/google-login`, { token });
        return response.data;
    } catch (error) {
        console.error("Erro no login com Google:", error.response?.data || error.message);
        throw error;
    }
};

// 🚀 **Função para acessar uma rota protegida**
export const getProtectedData = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/protected/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao acessar rota protegida:", error.response?.data || error.message);
        throw error;
    }
};

// 🚀 **Função para logout (remove o token do localStorage)**
export const logoutUser = () => {
    localStorage.removeItem("token");
};

// Função para buscar usuários
export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/list`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error.response?.data || error.message);
        return [];
    }
};

// Função para buscar tarefas
export const getTasks = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error.response?.data || error.message);
        throw error;
    }
};

// Função para criar uma tarefa
export const createTask = async (token, task) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, task, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar tarefa:", error.response?.data || error.message);
        throw error;
    }
};

// Função para editar uma tarefa
export const updateTask = async (token, taskId, updatedTask) => {
    try {
        const response = await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error.response?.data || error.message);
        throw error;
    }
};


// Função para deletar uma tarefa
export const deleteTask = async (token, taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error.response?.data || error.message);
      throw error;
    }
};
  
// Função para buscar dados do dashboard
export const get_dashboard = async ({ day, total, completed, pending } = {}) => {
    try {
        const params = {};

        if (day) params.day = day;
        if (total !== undefined) params.total = total;
        if (completed !== undefined) params.completed = completed;
        if (pending !== undefined) params.pending = pending;

        const response = await axios.get(`${API_URL}/graphs/dashboard`, { params });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error.response?.data || error.message || "Erro desconhecido");
        throw error;
    }
};