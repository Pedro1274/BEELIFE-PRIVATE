from fastapi import HTTPException, status
from database.database import users_collection
from models.user_model import User
import bcrypt
import jwt
from datetime import datetime, timedelta
from pydantic import EmailStr
import os

# Chave secreta para assinar o JWT (agora sendo carregada de uma variável de ambiente)
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Tempo de expiração do token

# Função para gerar um token JWT
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Função para validar a senha (por exemplo, comprimento mínimo)
def validate_password(password: str) -> bool:
    # Você pode adicionar regras de validação aqui, como comprimento mínimo ou caracteres especiais
    return len(password) >= 8  # Exemplo simples de validação (mínimo de 8 caracteres)

# Função para criar um novo usuário no sistema
async def register_user(username: str, password: str, email: EmailStr):
    # Verifica se o nome de usuário já está registrado no banco de dados
    user_exists = await users_collection.find_one({"email": email})
    
    if user_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já registrado")
    
    # Verifica se a senha é válida
    if not validate_password(password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Senha fraca. A senha deve ter pelo menos 8 caracteres.")
    
    # Criptografando a senha antes de armazená-la
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    
    # Criação do novo usuário com a senha criptografada
    new_user = User(username=username, password=hashed_password.decode("utf-8"), email=email)
    await users_collection.insert_one(new_user.dict())  # Assuming dict() method is implemented in User model
    
    return {"message": "Usuário criado com sucesso"}  # Mensagem de sucesso

# Função para fazer o login de um usuário
async def login_user(login: str, password: str):
    try:
        print(f"Tentando login para: {login}")

        user = None
        if "@" in login:
            user = await users_collection.find_one({"email": login})
        else:
            user = await users_collection.find_one({"username": login})

        if not user:
            print("Usuário não encontrado")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")

        # Certifique-se de que a senha esteja presente
        if "password" not in user or not user["password"]:
            print("Senha ausente no documento do usuário")
            raise HTTPException(status_code=500, detail="Erro interno: senha não encontrada")

        if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            print("Senha incorreta")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha incorreta")

        # Geração do token
        token = create_access_token(data={"sub": user["username"]})
        print(f"Login bem-sucedido para {user['username']}")

        return {"token": token, "username": user["username"]}

    except HTTPException as e:
        raise e  # Deixa o FastAPI cuidar
    except Exception as e:
        print(f"Erro inesperado no login_user: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao tentar fazer login")
