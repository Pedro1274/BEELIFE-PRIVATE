from fastapi import APIRouter, HTTPException, Body
from models.user_model import User
from database.database import users_collection
from api.users import register_user, login_user
from fastapi.security import OAuth2PasswordBearer
from database.firebase_auth import verify_google_token
from models.googleloginrequest import GoogleLoginRequest
from database.token import create_access_token, verify_access_token

user_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@user_router.post("/register")
async def register(user: User):
    created = await register_user(user.username, user.password, user.email)
    if not created:
        raise HTTPException(status_code=400, detail="Usuário já existe")
    return {"message": "Usuário registrado com sucesso!"}

@user_router.post("/login")
async def login(login: str = Body(...), password: str = Body(...)):
    token_data = await login_user(login, password)
    if not token_data:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    return token_data

@user_router.get("/list")
async def get_users():
    users = await users_collection.find().to_list(100)  # Busca os usuários no banco
    if not users:
        raise HTTPException(status_code=404, detail="Nenhum usuário encontrado")
    
    user_list = [{"username": user["username"]} for user in users]  # Filtra apenas os nomes
    return user_list  # Retorna a lista de usuários

@user_router.post("/google-login")
async def google_login(request: GoogleLoginRequest):
    """Login via Google"""
    google_user = verify_google_token(request.token)  
    if not google_user:
        raise HTTPException(status_code=401, detail="Token inválido")

    email = google_user["email"]
    user = await users_collection.find_one({"email": email})

    if not user:
        await users_collection.insert_one({"username": google_user["name"], "email": email})

    access_token = create_access_token({"sub": email})
    return {"access_token": access_token, "token_type": "bearer", "username": google_user["name"]}
    
