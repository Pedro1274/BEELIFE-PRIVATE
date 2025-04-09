from fastapi import Request
from starlette.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from database.token import verify_access_token
from database.database import users_collection

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            if (request.url.path.startswith("/api/tasks") or request.url.path.startswith("/api/patterns")) \
                and not request.url.path.endswith("/google-event"):
                auth_header = request.headers.get("Authorization")
                if not auth_header or not auth_header.startswith("Bearer "):
                    return JSONResponse(status_code=401, content={"detail": "Token não encontrado"})

                token = auth_header.split(" ")[1]
                payload = verify_access_token(token)
                if not payload:
                    return JSONResponse(status_code=401, content={"detail": "Token inválido"})

                username = payload.get("sub")
                user = await users_collection.find_one({"username": username})
                if not user:
                    return JSONResponse(status_code=401, content={"detail": "Usuário não encontrado"})

                request.state.user = user

            response = await call_next(request)
            return response

        except Exception as e:
            return JSONResponse(status_code=500, content={"detail": str(e)})
