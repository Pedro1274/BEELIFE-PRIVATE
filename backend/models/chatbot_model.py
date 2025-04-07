from pydantic import BaseModel

# Modelo de requisição
class ChatRequest(BaseModel):
    message: str

# Modelo de resposta
class ChatResponse(BaseModel):
    response: str