import os
from motor.motor_asyncio import AsyncIOMotorClient

# A variável MONGO_URI carrega a URI de conexão com o banco de dados MongoDB, 
# utilizando a função os.getenv() para pegar a variável de ambiente ou um valor padrão.
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI não encontrada no arquivo .env")

# O cliente do MongoDB é criado usando o AsyncIOMotorClient, que é uma versão assíncrona do motor do MongoDB.
client = AsyncIOMotorClient(MONGO_URI)

# Conecta-se ao banco de dados "assistente" usando o cliente criado.
db = client.assistente

# Define as coleções (tabelas no MongoDB) que serão utilizadas: "tasks" para tarefas e "users" para usuários.
dashboard_collection = db.dashboard
tasks_collection = db.tasks
users_collection = db.users
