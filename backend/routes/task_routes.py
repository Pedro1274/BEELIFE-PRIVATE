from fastapi import APIRouter
from models.task_model import Task
from api.tasks import get_tasks, create_task, update_task, delete_task
from api.google_calendar import add_event_to_google_calendar

task_router = APIRouter()

@task_router.get("/")
async def read_tasks():
    tasks = await get_tasks()
    return tasks

@task_router.post("/")
async def add_task(task: Task):
    new_task = await create_task(task)
    return new_task

@task_router.put("/{task_id}")
async def edit_task(task_id: str, updated_task: Task):
    updated = await update_task(task_id, updated_task)
    return updated

@task_router.delete("/{task_id}")
async def remove_task(task_id: str):
    deleted = await delete_task(task_id)
    return deleted

@task_router.post("/google-event")
async def create_google_event(task: Task):
    response = await add_event_to_google_calendar(task.model_dump())
    return response