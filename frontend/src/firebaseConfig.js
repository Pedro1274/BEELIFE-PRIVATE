import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
    const token = await result.user.getIdToken(); // Obtém o token JWT
    return token;
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    return null;
  }
};

export { auth, provider };
