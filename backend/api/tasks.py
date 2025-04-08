from bson import ObjectId, errors
from models.task_model import Task
from database.database import tasks_collection

# Função para recuperar todas as tarefas de um usuário específico
async def get_tasks(user_id: str):
    tasks = []  # Lista para armazenar as tarefas
    async for task in tasks_collection.find({"user_id": user_id}):  # Filtra pelo user_id
        task["_id"] = str(task["_id"])
        tasks.append(task)
    return tasks

# Função para criar uma nova tarefa no banco de dados
async def create_task(task_data: dict):
    new_task = await tasks_collection.insert_one(task_data)
    created_task = await tasks_collection.find_one({"_id": new_task.inserted_id})
    if created_task:
        created_task["_id"] = str(created_task["_id"])
    return created_task

# Atualizar tarefa apenas se for do usuário logado
async def update_task(task_id: str, updated_task: Task, user_id: str):
    result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id), "user_id": user_id},  # Verifica também o dono
        {"$set": updated_task.model_dump()}
    )
    return result.modified_count > 0

# Deletar tarefa apenas se for do usuário logado
async def delete_task(task_id: str, user_id: str):
    try:
        object_id = ObjectId(task_id)
    except errors.InvalidId:
        return False

    result = await tasks_collection.delete_one({"_id": object_id, "user_id": user_id})
    return result.deleted_count > 0