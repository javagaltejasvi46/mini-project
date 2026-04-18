from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from config import settings
from database import db_manager
from clients.tomtom import TomTomTrafficClient
from clients.openweather import OpenWeatherClient
from clients.google_places import GooglePlacesClient
from scheduler import DataIngestionScheduler
from api.traffic import router as traffic_router
from api.predict import router as predict_router
from api.route import router as route_router
from api.feedback import router as feedback_router

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

# Initialize clients
tomtom_client = TomTomTrafficClient(settings.TOMTOM_API_KEY) if settings.TOMTOM_API_KEY else None
weather_client = OpenWeatherClient(settings.OPENWEATHER_API_KEY) if settings.OPENWEATHER_API_KEY else None
places_client = GooglePlacesClient(settings.GOOGLE_API_KEY) if settings.GOOGLE_API_KEY else None

# Initialize scheduler
scheduler = None
if tomtom_client and weather_client and places_client:
    scheduler = DataIngestionScheduler(tomtom_client, weather_client, places_client)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting SmartRoute AI Backend...")
    db_manager.create_tables()
    logger.info("Database tables created")
    
    if scheduler:
        scheduler.start(settings.monitoring_locations_list, interval_minutes=5)
        logger.info("Data ingestion scheduler started")
    
    yield
    
    # Shutdown
    if scheduler:
        scheduler.stop()
        logger.info("Scheduler stopped")

app = FastAPI(title="SmartRoute AI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(traffic_router)
app.include_router(predict_router)
app.include_router(route_router)
app.include_router(feedback_router)

@app.get("/")
def read_root():
    return {"message": "SmartRoute AI Backend", "status": "active"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "scheduler": "running" if scheduler else "disabled"
    }

@app.post("/admin/fetch-data")
async def manual_data_fetch():
    """Manually trigger data ingestion"""
    if not scheduler:
        return {"status": "error", "message": "Scheduler not initialized"}
    
    try:
        await scheduler.ingest_traffic_data(settings.monitoring_locations_list)
        return {
            "status": "success",
            "message": "Data fetch completed",
            "locations": len(settings.monitoring_locations_list)
        }
    except Exception as e:
        logger.error(f"Manual fetch failed: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
