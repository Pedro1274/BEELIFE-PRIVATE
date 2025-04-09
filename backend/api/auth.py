from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from database.token import verify_access_token
from database.database import users_collection

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if (request.url.path.startswith("/api/tasks") or request.url.path.startswith("/padroes")) \
            and not request.url.path.endswith("/google-event"):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="Token não encontrado")

            token = auth_header.split(" ")[1]
            payload = verify_access_token(token)
            if not payload:
                raise HTTPException(status_code=401, detail="Token inválido")

            username = payload.get("sub")
            user = await users_collection.find_one({"username": username})
            if not user:
                raise HTTPException(status_code=401, detail="Usuário não encontrado")

            request.state.user = user

        response = await call_next(request)
        return response
