# Event Data Sources for Bangalore Traffic Prediction

## Recommended Approach

### Primary: Google Places API
- **API**: Google Places API (Nearby Search)
- **Key**: Same as Google Directions API
- **Usage**: Detect high-traffic venues and their busy times
- **Endpoint**: https://maps.googleapis.com/maps/api/place/nearbysearch/json

**Example venues to monitor in Bangalore:**
- M. Chinnaswamy Stadium (Cricket)
- Bangalore Palace (Events)
- UB City Mall
- Phoenix Marketcity
- Orion Mall
- Manyata Tech Park
- Electronic City

### Secondary: Manual Event Database

Create a simple events table:

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location GEOGRAPHY(Point, 4326),
    venue_name VARCHAR(255),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    event_type VARCHAR(50), -- cricket, concert, festival, holiday
    expected_attendance INT,
    impact_radius_km FLOAT DEFAULT 2.0
);
```

**Major Bangalore Events to Track:**
- IPL Cricket Matches (Chinnaswamy Stadium)
- Diwali, Dasara, Ugadi (festivals)
- New Year's Eve (MG Road, Brigade Road)
- Sunburn Festival
- Comic Con Bangalore
- Tech conferences (Manyata, Whitefield)

### Tertiary: BookMyShow Scraping (Optional)

Simple Python scraper for Bangalore events:
```python
import requests
from bs4 import BeautifulSoup

def scrape_bookmyshow_bangalore():
    url = "https://in.bookmyshow.com/explore/events-bangalore"
    # Implement scraping logic
    pass
```

## Implementation Strategy

### Phase 1 (MVP):
1. Use Google Places API to detect venues
2. Create manual events table with major Bangalore events
3. Simple boolean: is_event = (nearby_event_count > 0)

### Phase 2 (Enhanced):
1. Add BookMyShow scraping
2. Integrate event timing and attendance
3. Calculate event impact radius

### Phase 3 (Advanced):
1. Machine learning to predict event impact
2. Historical event-traffic correlation
3. Real-time event detection

## API Configuration

Update your .env file:
```bash
# Google APIs (single key for both)
GOOGLE_API_KEY=your_google_api_key_here

# Event Detection
EVENT_DETECTION_ENABLED=true
EVENT_VENUES_FILE=data/bangalore_venues.json
MANUAL_EVENTS_ENABLED=true
```

## Bangalore Venue Coordinates

Key venues to monitor:
```json
{
  "venues": [
    {
      "name": "M. Chinnaswamy Stadium",
      "lat": 12.9789,
      "lon": 77.5996,
      "type": "sports",
      "capacity": 40000
    },
    {
      "name": "Bangalore Palace",
      "lat": 12.9980,
      "lon": 77.5920,
      "type": "events",
      "capacity": 10000
    },
    {
      "name": "UB City Mall",
      "lat": 12.9716,
      "lon": 77.5946,
      "type": "shopping",
      "capacity": 5000
    },
    {
      "name": "Phoenix Marketcity",
      "lat": 12.9952,
      "lon": 77.6969,
      "type": "shopping",
      "capacity": 8000
    },
    {
      "name": "Orion Mall",
      "lat": 13.0102,
      "lon": 77.5525,
      "type": "shopping",
      "capacity": 6000
    }
  ]
}
```

## Cost Analysis

| Source | Cost | Coverage | Effort |
|--------|------|----------|--------|
| Google Places | $200 credit/month | Excellent | Low |
| Manual Events | Free | Good | Medium |
| BookMyShow Scraping | Free | Excellent | High |
| PredictHQ | $99+/month | Excellent | Low |

**Recommendation**: Start with Google Places + Manual Events (Free with Google credit)
