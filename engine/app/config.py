import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "LokalScout Enterprise Engine"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Server
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # AI Synthesis
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Cashfree Payments Gateway (https://www.cashfree.com)
    CASHFREE_APP_ID: str = os.getenv("CASHFREE_APP_ID", "TEST_CF_MOCK_APP_ID")
    CASHFREE_SECRET_KEY: str = os.getenv("CASHFREE_SECRET_KEY", "TEST_CF_MOCK_SECRET_KEY")
    CASHFREE_API_VERSION: str = os.getenv("CASHFREE_API_VERSION", "2023-08-01")
    CASHFREE_ENV: str = os.getenv("CASHFREE_ENV", "sandbox") # "sandbox" or "production"
    
    # Google Auth Client ID (for token verification)
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    
    # Security & CORS
    API_AUTH_SECRET: str = os.getenv("API_AUTH_SECRET", "lokalscout_enterprise_secret_2026")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3005",
        "https://lokalscout.in",
        "https://www.lokalscout.in",
        "https://engine.lokalscout.in",
    ]
    
    # Overpass & Geocoding Endpoints
    OVERPASS_URL: str = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")
    NOMINATIM_URL: str = os.getenv("NOMINATIM_URL", "https://nominatim.openstreetmap.org/search")
    NOMINATIM_REVERSE_URL: str = os.getenv("NOMINATIM_REVERSE_URL", "https://nominatim.openstreetmap.org/reverse")

    # Google Places API (New) for zero-cost competitor ratings and reviews
    GOOGLE_PLACES_API_KEY: str = os.getenv("GOOGLE_PLACES_API_KEY", "")
    
    # SQLite Database Cache Path
    LOKALSCOUT_DB_PATH: str = os.getenv("LOKALSCOUT_DB_PATH", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
