from fastapi import APIRouter
from api.chatbot import get_chat_response

chat_router = APIRouter()

@chat_router.post("/chat")
async def chat(message: dict):
    user_message = message.get("text", "")
    if not user_message:
        return {"error": "Mensagem vazia!"}

    response = get_chat_response(user_message)
    return {"response": response}
