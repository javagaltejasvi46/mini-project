from pydantic_settings import BaseSettings
from typing import List, Tuple
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # External APIs
    GOOGLE_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""
    TOMTOM_API_KEY: str = ""
    
    # Event Detection
    EVENT_DETECTION_ENABLED: bool = True
    EVENT_VENUES_FILE: str = "data/bangalore_venues.json"
    MANUAL_EVENTS_ENABLED: bool = True
    
    # Security
    SECRET_KEY: str
    API_KEY_SALT: str
    
    # Application
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174"
    
    # ML Models
    TABNET_MODEL_PATH: str = "models/tabnet_model.pkl"
    GNN_MODEL_PATH: str = "models/gnn_model.pkl"
    
    # Monitoring Locations
    MONITORING_LOCATIONS: str = "12.97,77.59;12.93,77.62;12.92,77.62"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def monitoring_locations_list(self) -> List[Tuple[float, float]]:
        locations = []
        for loc in self.MONITORING_LOCATIONS.split(";"):
            lat, lon = loc.strip().split(",")
            locations.append((float(lat), float(lon)))
        return locations

settings = Settings()
