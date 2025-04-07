from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Task(BaseModel):
	title: str = Field(..., description="Título da tarefa")
	description: Optional[str] = Field(None, description="Descrição da terefa")
	due_date: Optional[datetime] = Field(None, description="Data e hora de conclusão")
	priority: Optional[str] = Field("normal", description="Prioridade da tarefa: baixa, normal, alta")
	completed: bool = False
	category: str = Field(..., description="Tipo: tarefa, evento, lembrete, nota")
	created_at: datetime = Field(default_factory=datetime.utcnow)