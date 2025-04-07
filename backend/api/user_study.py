from fastapi import FastAPI, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
import pandas as pd
from collections import Counter
from datetime import datetime

# 🔹 Conectar ao MongoDB
MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "gestao_tarefas"
COLLECTION_NAME = "tarefas"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
tarefas_collection = db[COLLECTION_NAME]

# 🔹 FastAPI App
app = FastAPI()

# 🔹 Função para detectar padrões no MongoDB
async def detectar_padroes():
    tarefas = await tarefas_collection.find().to_list(None)
    if not tarefas:
        return {"message": "Nenhum dado disponível."}

    df = pd.DataFrame(tarefas)
    df["data"] = pd.to_datetime(df["data"])

    dias_frequentes = Counter(df['data'].dt.day_name()).most_common(3)
    horarios_frequentes = Counter(df['horario']).most_common(3)
    tarefas_frequentes = Counter(df['nome']).most_common(3)

    return {
        "dias_frequentes": dias_frequentes,
        "horarios_frequentes": horarios_frequentes,
        "tarefas_frequentes": tarefas_frequentes
    }

# 🔹 Função para gerar avisos baseados no histórico do cliente
async def gerar_avisos():
    tarefas = await tarefas_collection.find().to_list(None)
    if not tarefas:
        return []

    dias_adiados = [t["data"] for t in tarefas if t["status"] == "adiado"]
    horarios_concluidos = [t["horario"] for t in tarefas if t["status"] == "concluído"]

    avisos = []

    if dias_adiados:
        dia_mais_adiado = Counter(dias_adiados).most_common(1)[0][0]
        avisos.append(f"⚠️ Você costuma adiar compromissos às {dia_mais_adiado}s. Deseja reagendar?")

    if horarios_concluidos:
        horario_mais_produtivo = Counter(horarios_concluidos).most_common(1)[0][0]
        avisos.append(f"💡 Você geralmente é mais produtivo às {horario_mais_produtivo}. Deseja marcar tarefas nesse horário?")

    return avisos

async def priorizar_tarefas():
    tarefas = await tarefas_collection.find().to_list(None)
    if not tarefas:
        return {"message": "Nenhuma tarefa disponível para priorização."}

    # Transformar em DataFrame para análise
    df = pd.DataFrame(tarefas)
    df["data"] = pd.to_datetime(df["data"])

    # Criar pontuação baseada na frequência, status e prazo
    df["prioridade"] = 0

    # Se uma tarefa foi adiada, aumentar prioridade
    df.loc[df["status"] == "adiado", "prioridade"] += 3

    # Se for uma tarefa comum, aumentar prioridade
    contagem_tarefas = df["nome"].value_counts().to_dict()
    df["prioridade"] += df["nome"].map(contagem_tarefas)

    # Quanto menor o prazo, maior a prioridade
    hoje = datetime.now()
    df["urgencia"] = (df["data"] - hoje).dt.days
    df.loc[df["urgencia"] <= 2, "prioridade"] += 5  # Urgente se falta 2 dias ou menos

    # Ordenar pela maior prioridade
    df = df.sort_values(by="prioridade", ascending=False)

    return df[["nome", "data", "prioridade"]].to_dict(orient="records")

async def horarios_ideais():
    tarefas = await tarefas_collection.find().to_list(None)
    if not tarefas:
        return {"message": "Nenhum dado suficiente para análise."}

    df = pd.DataFrame(tarefas)

    # Filtrar apenas tarefas concluídas
    df_concluidas = df[df["status"] == "concluído"]

    # Contar horários mais produtivos
    horarios_frequentes = Counter(df_concluidas["horario"]).most_common(3)

    return {"horarios_recomendados": horarios_frequentes}

# Criar endpoint para horários ideais
@app.get("/api/horarios")
async def api_horarios():
    return await horarios_ideais()

# Criar endpoint para priorização
@app.get("/api/prioridade")
async def api_prioridade():
    return await priorizar_tarefas()

# 🔹 Endpoints FastAPI
@app.get("/api/padroes")
async def api_padroes():
    return await detectar_padroes()

@app.get("/api/avisos")
async def api_avisos():
    return {"avisos": await gerar_avisos()}

@app.post("/api/tarefa")
async def adicionar_tarefa(nome: str, data: str, horario: str, status: str):
    nova_tarefa = {
        "nome": nome,
        "data": datetime.strptime(data, "%Y-%m-%d"),
        "horario": horario,
        "status": status
    }
    result = await tarefas_collection.insert_one(nova_tarefa)
    if result.inserted_id:
        return {"message": "Tarefa adicionada com sucesso!"}
    else:
        raise HTTPException(status_code=500, detail="Erro ao adicionar tarefa.")
