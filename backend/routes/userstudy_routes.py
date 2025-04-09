from fastapi import APIRouter, Request
from datetime import datetime, timedelta
from collections import Counter, defaultdict
from database.database import tasks_collection

userstudy_router = APIRouter()

def calcular_score(tarefa, hoje):
    score = 0

    if tarefa.get("due_date") and (tarefa["due_date"] - hoje).days <= 2:
        score += 2

    if tarefa.get("priority") == "alta":
        score += 2
    elif tarefa.get("priority") == "média":
        score += 1

    if tarefa.get("due_date") and tarefa["due_date"] < hoje and not tarefa["completed"]:
        score += 3

    return score

def sugerir_horarios(dias_frequentes):
    sugestoes = []

    for dia in dias_frequentes:
        if dia["frequencia"] >= 4:
            sugestoes.append(
                f"📅 Você costuma ter muitas tarefas às {dia['dia']}s. Tente mover algumas para dias menos cheios."
            )

    return sugestoes

@userstudy_router.get("/padroes")
async def analisar_padroes(request: Request):
    user = request.state.user
    user_id = str(user["_id"])

    tarefas = await tasks_collection.find(
        {"user_id": user_id},
        {
            "_id": 0,
            "due_date": 1,
            "priority": 1,
            "title": 1,
            "completed": 1
        }
    ).to_list(None)

    dias = []
    hoje = datetime.now()
    tarefas_atrasadas = []

    for t in tarefas:
        due_date = t.get("due_date")

        try:
            if isinstance(due_date, str):
                due_date = datetime.fromisoformat(due_date)
            elif not isinstance(due_date, datetime):
                continue  # ignora valores inválidos

            t["due_date"] = due_date
            dia_semana = due_date.strftime("%A")
            dias.append(dia_semana)

            if due_date < hoje and not t["completed"]:
                tarefas_atrasadas.append({
                    "tarefa": t["title"],
                    "vencimento": due_date.strftime('%d/%m às %H:%M')
                })

        except Exception as e:
            print(f"[ERRO] Falha ao processar data da tarefa '{t.get('title', '[sem título]')}': {e}")
            continue

    prioridades = [t["priority"] for t in tarefas if t.get("priority")]
    tarefas_frequentes = [t["title"] for t in tarefas if t.get("title")]

    dias_frequentes = Counter(dias).most_common(3)
    prioridades_frequentes = Counter(prioridades).most_common(3)
    tarefas_prioritarias = Counter(tarefas_frequentes).most_common(3)

    # Priorização automática
    tarefas_com_score = []
    for t in tarefas:
        if not t.get("due_date"):
            continue
        t["score"] = calcular_score(t, hoje)
        tarefas_com_score.append(t)

    tarefas_com_score.sort(key=lambda t: t["score"], reverse=True)
    tarefas_prioritarias_auto = [
        {"tarefa": t["title"], "prioridade_score": t["score"]}
        for t in tarefas_com_score[:5]
    ]

    # Sugestões de horários
    sugestoes_horarios = sugerir_horarios(
        [{"dia": d, "frequencia": f} for d, f in dias_frequentes]
    )

    return {
        "dias_frequentes": [{"dia": d, "frequencia": f} for d, f in dias_frequentes],
        "prioridades_frequentes": [{"prioridade": p, "frequencia": f} for p, f in prioridades_frequentes],
        "tarefas_prioritarias": [{"tarefa": t, "frequencia": f} for t, f in tarefas_prioritarias],
        "tarefas_prioritarias_automaticas": tarefas_prioritarias_auto,
        "sugestoes_horarios": sugestoes_horarios,
        "tarefas_atrasadas": tarefas_atrasadas
    }

@userstudy_router.get("/avisos")
async def gerar_avisos():
    tarefas = await tasks_collection.find(
        {}, 
        {"_id": 0, "title": 1, "due_date": 1, "priority": 1, "completed": 1}
    ).to_list(None)
    
    avisos = []
    hoje = datetime.now()
    adiamentos_por_dia = defaultdict(int)

    for t in tarefas:
        due_date = t.get("due_date")

        if isinstance(due_date, str):
            due_date = datetime.fromisoformat(due_date)
        elif not isinstance(due_date, datetime):
            continue

        t["due_date"] = due_date
        atrasada = due_date < hoje and not t["completed"]

        if atrasada:
            avisos.append(f"❌ Tarefa '{t['title']}' está atrasada! Venceu em {due_date.strftime('%d/%m ás %H:%M')}.")
            dia_da_semana = due_date.strftime("%A")
            adiamentos_por_dia[dia_da_semana] += 1
        else:
            prazo_curto = due_date - hoje < timedelta(days=2)
            if prazo_curto and t["priority"] == "alta":
                avisos.append(f"⚠️ Tarefa urgente '{t['title']}' vence em breve ({due_date.strftime('%d/%m ás %H:%M')}).")
        
    #for dia, count in adiamentos_por_dia.items():
        #if count >= 2:
            #avisos.append(f"📌 Você costuma adiar tarefas às {dia}s. Deseja reagendar futuras tarefas para outro dia?")

    return {"avisos": avisos}