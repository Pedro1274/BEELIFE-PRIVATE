import React from "react"; // Importa o React para criar componentes
import ReactDOM from "react-dom"; // Importa ReactDOM para renderizar o componente no DOM
import App from "./AppTemp"; // Importa o componente principal da aplicação (AppTemp)
import { BrowserRouter } from "react-router-dom"; // Importa o BrowserRouter para gerenciar as rotas do React
import "./index.css"; // Importa o arquivo de estilos CSS

// Renderiza o componente App no elemento com o id "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Envolvendo a aplicação com o BrowserRouter para usar as rotas */}
    <BrowserRouter>
      <App /> {/* Componente principal da aplicação */}
    </BrowserRouter>
  </React.StrictMode>
);
