import { Navigate } from "react-router-dom";

function PrivateRoute({ element }) {
  // Verifica se o usuário está autenticado ao verificar a existência do token no localStorage
  const isAuthenticated = localStorage.getItem("token") !== null;

  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Se o usuário estiver autenticado, retorna o componente da rota protegida
  return element;
}

export default PrivateRoute;
