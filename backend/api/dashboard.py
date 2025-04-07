from collections import defaultdict
from datetime import datetime
from typing import Optional
from models.dashboard_model import DashboardResponse
from api.tasks import get_tasks  # Função para obter as tarefas

async def process_dashboard_data(day: Optional[str] = None, total: Optional[int] = None, completed: Optional[int] = None, pending: Optional[int] = None):
    tasks = await get_tasks()  # Obtém as tarefas da API ou banco de dados
    print(f"Tarefas recebidas: {tasks}")  # Log para verificar as tarefas recebidas
    
    if not tasks:
        return []  # Retorna lista vazia se não houver tarefas

    # Usando defaultdict para contar o número de tarefas
    stats = defaultdict(lambda: {"total": 0, "completed": 0, "pending": 0})

    for task in tasks:
        # Garantir que a tarefa tenha o campo 'title' e 'completed' para evitar erros
        if "title" not in task or "completed" not in task:
            continue  # Ignora tarefas com dados faltando

        # Adiciona lógica para calcular o 'day_of_week' com base na data de criação (supondo que você tenha esse campo)
        task_day = "Unknown"  # Default caso não exista data
        if "date" in task:
            try:
                task_day = datetime.fromisoformat(task["date"]).strftime("%A")  # Converte para o nome do dia
            except (ValueError, TypeError):
                continue  # Caso a data seja inválida, ignorar tarefa

        # Filtra tarefas com base no 'day' se fornecido
        if day and task_day != day:
            continue  

        # Contabiliza tarefas de acordo com o seu status
        if task["completed"]:
            stats[task_day]["completed"] += 1
        else:
            stats[task_day]["pending"] += 1

        stats[task_day]["total"] += 1  # Total de tarefas contadas independentemente do status

    # Montando a resposta a ser retornada
    result = [
        DashboardResponse(
            day_of_week=task_day,
            total_tasks=counts["total"],
            completed_tasks=counts["completed"],
            pending_tasks=counts["pending"]
        )
        for task_day, counts in stats.items()
        if (total is None or counts["total"] == total) and
           (completed is None or counts["completed"] == completed) and
           (pending is None or counts["pending"] == pending)
    ]

    return result  # Retorna uma lista de resultados para o dashboard
