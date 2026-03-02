from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, survey
from app.db.base import Base
from app.db.session import engine
import logging

logging.basicConfig(level=logging.INFO)

# Create all tables zero-config style
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(survey.router, prefix=f"{settings.API_V1_STR}/survey", tags=["survey"])

@app.get("/")
def root():
    return {"message": "Welcome to PsychoPolitical Analytics API. Please visit http://localhost:3000 for the frontend."}

@app.get("/health")
def health_check():
    return {"status": "ok"}
