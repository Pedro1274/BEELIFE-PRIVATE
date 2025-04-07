import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# 🔹 Configuração do MongoDB (Substitua pelo seu URI do MongoDB Atlas)
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI não encontrada no arquivo .env")

# 🔹 Configuração do Firebase Authentication (Carregando o JSON do Firebase Admin SDK)
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS_PATH")
if not FIREBASE_CREDENTIALS:
    raise ValueError("Caminho para as credenciais do Firebase não encontrado no arquivo .env")

# Verificar se o Firebase foi inicializado, ou inicializar com nome único se necessário
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred, name="unique-app-name")

# Configuração do ChatBot
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY não encontrada! Defina no .env ou nas variáveis de ambiente.")

# 🔹 Configuração do JWT
SECRET_KEY = os.getenv("SECRET_KEY", "seu_segredo_super_secreto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
