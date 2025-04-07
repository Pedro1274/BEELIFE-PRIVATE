from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.task_routes import task_router
from routes.user_routes import user_router
from routes.dashboard_routes import dashboard_router  # Importe o roteador de dashboard
from routes.chatbot_routes import chat_router
from routes.userstudy_routes import userstudy_router
import google.generativeai as genai
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://beelife.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas de tarefas
app.include_router(task_router, prefix="/api/tasks", tags=["tasks"])

# Inclui as rotas de usuários
app.include_router(user_router, prefix="/api/users", tags=["users"])

# Inclui as rotas de dashboard
app.include_router(dashboard_router, prefix="/api/graphs", tags=["graphs"])  # Adicione esta linha

# Inclui as rotas de chat
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

# Adiciona a análise de padrões e avisos
app.include_router(userstudy_router, prefix="/api/patterns", tags=["patterns"])

# Rota raiz
@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao assistente inteligente!"}

# Comando para lançar o backend no localhost: python -m uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
