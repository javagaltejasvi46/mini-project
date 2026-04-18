import httpx
import asyncio
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class BaseAPIClient:
    def __init__(self, base_url: str, api_key: str, timeout: int = 30):
        self.base_url = base_url
        self.api_key = api_key
        self.timeout = timeout
    
    async def fetch_with_retry(self, url: str, params: dict = None, headers: dict = None, max_retries: int = 3):
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.get(url, params=params, headers=headers)
                    
                    if response.status_code == 429:
                        wait_time = int(response.headers.get('Retry-After', 60))
                        logger.warning(f"Rate limit hit, waiting {wait_time}s")
                        await asyncio.sleep(wait_time)
                        continue
                    
                    response.raise_for_status()
                    return response.json()
                    
            except httpx.HTTPError as e:
                if attempt == max_retries - 1:
                    logger.error(f"API call failed after {max_retries} retries: {e}")
                    raise
                await asyncio.sleep(2 ** attempt)
        
        return None
