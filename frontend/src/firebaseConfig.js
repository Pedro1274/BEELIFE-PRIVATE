import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCkJpZI3afT4PnoNM99UzxlEaQmw8Ztgto",
  authDomain: "auth-3c9d2.firebaseapp.com",
  projectId: "auth-3c9d2",
  storageBucket: "auth-3c9d2.firebasestorage.app",
  messagingSenderId: "942490034705",
  appId: "1:942490034705:web:7dcd8fff6b7dbae22187b0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Função para fazer login com Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    // Dados do usuário
    const { displayName, email, photoURL, uid } = result.user;

    // Armazenar no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ displayName, email, photoURL, uid }));

    return { token, displayName, email, photoURL, uid };
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    return null;
  }
};

// Função para logout
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("Logout realizado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

// Monitorar mudanças no estado de autenticação
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user); // Usuário logado
    } else {
      callback(null); // Usuário deslogado
    }
  });
};

export { auth, provider };