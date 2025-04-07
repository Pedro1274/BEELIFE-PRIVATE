from datetime import datetime, timedelta
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# 🔹 Configurações do JWT
SECRET_KEY = os.getenv("SECRET_KEY")  # Chave secreta armazenada no .env
if not SECRET_KEY:
    raise ValueError("A variável de ambiente SECRET_KEY não está definida.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Tempo de expiração do token (1 hora)

def create_access_token(data: dict):
    """Gera um token JWT para autenticação."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})  # Define a expiração do token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str):
    """Verifica a validade do token JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Retorna os dados contidos no token
    except ExpiredSignatureError:
        return None  # Token expirado
    except InvalidTokenError:
        return None  # Token inválido
    except Exception as e:
        print(f"Erro ao verificar o token: {e}")
        return None  # Outros erros