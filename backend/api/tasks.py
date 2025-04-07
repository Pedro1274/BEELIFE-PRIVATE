from bson import ObjectId
from models.task_model import Task
from database.database import tasks_collection

# Função para recuperar todas as tarefas do banco de dados
async def get_tasks():
    tasks = []  # Lista para armazenar as tarefas
    async for task in tasks_collection.find():
        task["_id"] = str(task["_id"])  # Converte ObjectId para string
        tasks.append(task)
    return tasks  # Retorna a lista de tarefas  

# Função para criar uma nova tarefa no banco de dados
async def create_task(task: Task):
    task_data = task.model_dump()
    new_task = await tasks_collection.insert_one(task_data)
    created_task = await tasks_collection.find_one({"_id": new_task.inserted_id})
    if created_task:
        created_task["_id"] = str(created_task["_id"])
    return created_task  

# Função para atualizar uma tarefa existente
async def update_task(task_id: str, updated_task: Task):
    result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": updated_task.model_dump()}  # Corrigido model_dump()
    )
    return result.modified_count > 0  # Retorna True se a tarefa foi modificada

# Função para deletar uma tarefa do banco de dados
async def delete_task(task_id: str):
    result = await tasks_collection.delete_one({"_id": ObjectId(task_id)})
    return result.deleted_count > 0  # Retorna True se a tarefa foi deletada