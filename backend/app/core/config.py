from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "PsychoPolitical Analytics Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_THIS_IN_PRODUCTION_b4cc39")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./psychodb.sqlite")
    REDIS_URL: str = os.getenv("REDIS_URL", "") # Empty to disable redis by default
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "")

    class Config:
        case_sensitive = True

settings = Settings()
