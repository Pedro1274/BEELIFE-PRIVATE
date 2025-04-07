import google.generativeai as genai
from config import API_KEY

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel(model_name="gemini-1.5-flash")
chat_bot = model.start_chat(history=[])

def get_chat_response(message: str) -> str:
    """ Envia uma mensagem para o modelo Gemini e retorna a resposta. """
    response = chat_bot.send_message(message)
    return response.text
