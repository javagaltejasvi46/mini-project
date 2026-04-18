from typing import Dict, List
from .base import BaseAPIClient

class GooglePlacesClient(BaseAPIClient):
    def __init__(self, api_key: str):
        super().__init__(
            base_url="https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            api_key=api_key
        )
    
    async def get_nearby_events(
        self, 
        lat: float, 
        lon: float, 
        radius_km: float = 5.0
    ) -> List[Dict]:
        params = {
            "location": f"{lat},{lon}",
            "radius": int(radius_km * 1000),
            "key": self.api_key
        }
        result = await self.fetch_with_retry(self.base_url, params=params)
        return result.get("results", []) if result else []
