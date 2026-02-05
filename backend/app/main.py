from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.routes.chat import router as chat_router
from config.settings import settings


app = FastAPI(
    title=settings.APP_NAME,
    description="AI Chat Assistant powered by Gemini AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/v1", tags=["chat"])

# Serve static files from React build
frontend_build = Path(__file__).parent.parent.parent / "frontend" / "build"
if frontend_build.exists():
    app.mount("/", StaticFiles(directory=frontend_build, html=True), name="static")
else:
    @app.get("/")
    async def root():
        return {"message": "AI Chat Assistant API is running!"}
