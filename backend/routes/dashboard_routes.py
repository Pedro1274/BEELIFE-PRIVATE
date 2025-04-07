from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from models.dashboard_model import DashboardResponse
from api.dashboard import process_dashboard_data

dashboard_router = APIRouter()

@dashboard_router.get("/dashboard", response_model=List[DashboardResponse])
async def get_dashboard(
    day: Optional[str] = Query(None, description="Filtrar por dia da semana"),
    total: Optional[int] = Query(None, description="Filtrar por total de tarefas"),
    completed: Optional[int] = Query(None, description="Filtrar por tarefas concluídas"),
    pending: Optional[int] = Query(None, description="Filtrar por tarefas pendentes")
):
    data = await process_dashboard_data(day, total, completed, pending)
    if not data:
        raise HTTPException(status_code=404, detail="No tasks found")
    return data