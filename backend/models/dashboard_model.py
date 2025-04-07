from pydantic import BaseModel
from datetime import datetime

class TaskStatus(BaseModel):
    date: datetime
    status: str  # "completed" ou "pending"

class DashboardResponse(BaseModel):
    day_of_week: str
    total_tasks: int
    completed_tasks: int
    pending_tasks: int