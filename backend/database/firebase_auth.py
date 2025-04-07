import firebase_admin
from firebase_admin import auth, credentials

# 🔹 Carregar credenciais do Firebase (substitua pelo seu arquivo JSON)
cred = credentials.Certificate("auth-3c9d2-firebase-adminsdk-fbsvc-51a82a53e0.json")
firebase_admin.initialize_app(cred)

def verify_google_token(token: str):
    """Verifica o token JWT do Google e retorna os dados do usuário."""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print("Erro ao verificar token do Google:", e)
        return None
