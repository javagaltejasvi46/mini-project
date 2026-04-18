from typing import Dict, Tuple
from .base import BaseAPIClient

class GoogleDirectionsClient(BaseAPIClient):
    def __init__(self, api_key: str):
        super().__init__(
            base_url="https://maps.googleapis.com/maps/api/directions/json",
            api_key=api_key
        )
    
    async def get_directions(
        self, 
        origin: Tuple[float, float], 
        destination: Tuple[float, float]
    ) -> Dict:
        params = {
            "origin": f"{origin[0]},{origin[1]}",
            "destination": f"{destination[0]},{destination[1]}",
            "key": self.api_key,
            "alternatives": "true"
        }
        return await self.fetch_with_retry(self.base_url, params=params)
