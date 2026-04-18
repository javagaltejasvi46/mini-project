# Frontend-Backend Integration Test

## Current Status

✅ **Backend Running**: http://localhost:8000
✅ **Frontend Configured**: Calls backend at http://localhost:8000/predict
✅ **CORS Enabled**: Backend allows frontend origins

## Test the Integration

### 1. Start Frontend (if not running)

```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

### 2. Test API Call from Frontend

1. Open http://localhost:5173 in your browser
2. Enter location details:
   - Latitude: 12.97
   - Longitude: 77.59
   - Location Name: MG Road, Bangalore
3. Click "Analyze Traffic"
4. You should see:
   - Traffic level indicator
   - Traffic chart with historical data
   - Alternate routes
   - Recommendations

### 3. Manual API Test

```bash
# Test prediction endpoint
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 12.97,
    "longitude": 77.59,
    "location_name": "MG Road"
  }'

# Expected response:
{
  "location": "MG Road",
  "current_traffic_level": 45,
  "traffic_reason": "Heavy rush hour traffic",
  "prediction_confidence": 0.85,
  "predicted_delay": 12.5,
  "cause": "Heavy rush hour traffic",
  "traffic_data": [...],
  "alternate_routes": [],
  "recommendations": [...]
}
```

### 4. Test Traffic Query

```bash
curl "http://localhost:8000/traffic?lat=12.97&lon=77.59&radius_km=2"
```

### 5. Test Route Calculation

```bash
curl "http://localhost:8000/route?source_lat=12.97&source_lon=77.59&dest_lat=12.93&dest_lon=77.62"
```

## Integration Points

### Frontend → Backend

**File**: `frontend/src/components/TrafficDashboard.jsx`

```javascript
const handleLocationSubmit = async (locationData) => {
  setLoading(true)
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    })
    const data = await response.json()
    setTrafficData(data)
  } catch (error) {
    console.error('Error fetching traffic data:', error)
    alert('Failed to fetch traffic data. Make sure the backend is running.')
  } finally {
    setLoading(false)
  }
}
```

### Backend CORS Configuration

**File**: `backend/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,  # Includes http://localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Issue: CORS Error
**Solution**: Verify backend .env has correct CORS_ORIGINS:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Issue: Connection Refused
**Solution**: Ensure backend is running:
```bash
cd backend
python main.py
```

### Issue: No Traffic Data
**Solution**: Wait for scheduler to collect data (5 minutes) or manually insert test data:
```python
# backend/insert_test_data.py
from database import db_manager
from models import TrafficData
from datetime import datetime

with db_manager.get_session() as session:
    test_data = TrafficData(
        location='POINT(77.59 12.97)',
        timestamp=datetime.utcnow(),
        current_speed=35.0,
        congestion_ratio=2.5,
        rain=0.0,
        accident=False,
        event=False
    )
    session.add(test_data)
```

## Next Steps

1. ✅ Frontend-Backend connection established
2. ✅ API endpoints working
3. 🔄 Collect training data (2-4 weeks)
4. 🔄 Train ML models (see ML_MODEL_BLUEPRINT.md)
5. 🔄 Deploy trained models
6. 🔄 Monitor and improve

## API Documentation

Full API documentation available at: http://localhost:8000/docs
