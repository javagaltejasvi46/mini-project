from typing import Dict
from .base import BaseAPIClient

class TomTomTrafficClient(BaseAPIClient):
    def __init__(self, api_key: str):
        super().__init__(
            base_url="https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json",
            api_key=api_key
        )
    
    async def get_traffic_flow(self, lat: float, lon: float) -> Dict:
        url = f"{self.base_url}?point={lat},{lon}&key={self.api_key}"
        return await self.fetch_with_retry(url)
