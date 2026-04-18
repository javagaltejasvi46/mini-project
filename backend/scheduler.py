from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Tuple
import logging
from database import db_manager
from models import TrafficData
from clients.tomtom import TomTomTrafficClient
from clients.openweather import OpenWeatherClient
from clients.google_places import GooglePlacesClient

logger = logging.getLogger(__name__)

class DataIngestionScheduler:
    def __init__(
        self,
        tomtom_client: TomTomTrafficClient,
        weather_client: OpenWeatherClient,
        places_client: GooglePlacesClient
    ):
        self.tomtom_client = tomtom_client
        self.weather_client = weather_client
        self.places_client = places_client
        self.scheduler = AsyncIOScheduler()
    
    async def ingest_traffic_data(self, locations: List[Tuple[float, float]]):
        logger.info(f"Ingesting traffic data for {len(locations)} locations...")
        for lat, lon in locations:
            try:
                traffic = await self.tomtom_client.get_traffic_flow(lat, lon)
                weather = await self.weather_client.get_weather(lat, lon)
                events = await self.places_client.get_nearby_events(lat, lon)
                
                with db_manager.get_session() as session:
                    traffic_data = TrafficData(
                        location=f'POINT({lon} {lat})',
                        timestamp=datetime.utcnow(),
                        current_speed=traffic.get('currentSpeed', 0) if traffic else 30.0,
                        congestion_ratio=self._calculate_congestion(traffic) if traffic else 1.0,
                        rain=weather.get('rain', {}).get('1h', 0.0) if weather else 0.0,
                        accident=False,
                        event=len(events) > 0 if events else False
                    )
                    session.add(traffic_data)
                    session.commit()
                    logger.info(f"✓ Saved traffic data for ({lat}, {lon})")
                    
            except Exception as e:
                logger.error(f"Error ingesting data for {lat},{lon}: {e}", exc_info=True)
    
    def _calculate_congestion(self, traffic_data: dict) -> float:
        if not traffic_data:
            return 1.0
        current_speed = traffic_data.get('currentSpeed', 0)
        free_flow_speed = traffic_data.get('freeFlowSpeed', 1)
        return max(0, 1 - (current_speed / free_flow_speed)) if free_flow_speed > 0 else 0
    
    def start(self, locations: List[Tuple[float, float]], interval_minutes: int = 5):
        self.scheduler.add_job(
            self.ingest_traffic_data,
            'interval',
            minutes=interval_minutes,
            args=[locations],
            max_instances=1,
            misfire_grace_time=300
        )
        self.scheduler.start()
    
    def stop(self):
        self.scheduler.shutdown()
