from typing import Dict
from .base import BaseAPIClient

class OpenWeatherClient(BaseAPIClient):
    def __init__(self, api_key: str):
        super().__init__(
            base_url="https://api.openweathermap.org/data/2.5/weather",
            api_key=api_key
        )
    
    async def get_weather(self, lat: float, lon: float) -> Dict:
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"
        }
        return await self.fetch_with_retry(self.base_url, params=params)
