from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import random
from datetime import datetime, timedelta

app = FastAPI(title="Traffic Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: str

class TrafficDataPoint(BaseModel):
    time: str
    traffic_level: int
    speed: float

class AlternateRoute(BaseModel):
    route_name: str
    distance: float
    estimated_time: int
    traffic_level: str

class TrafficPredictionResponse(BaseModel):
    location: str
    current_traffic_level: int
    traffic_reason: str
    prediction_confidence: float
    traffic_data: List[TrafficDataPoint]
    alternate_routes: List[AlternateRoute]
    recommendations: List[str]

@app.get("/")
def read_root():
    return {"message": "Traffic Prediction API", "status": "active"}

@app.post("/predict", response_model=TrafficPredictionResponse)
def predict_traffic(location: LocationRequest):
    # Generate fake traffic data for demonstration
    traffic_reasons = [
        "Heavy rush hour traffic",
        "Road construction ahead",
        "Traffic accident reported",
        "Special event in the area",
        "Weather conditions affecting traffic",
        "School zone - peak hours"
    ]
    
    # Generate time series data
    traffic_data = []
    base_time = datetime.now() - timedelta(hours=2)
    for i in range(24):
        time_point = base_time + timedelta(minutes=i * 5)
        traffic_data.append(TrafficDataPoint(
            time=time_point.strftime("%H:%M"),
            traffic_level=random.randint(30, 95),
            speed=random.uniform(15.0, 60.0)
        ))
    
    # Generate alternate routes
    alternate_routes = [
        AlternateRoute(
            route_name="Via Highway Express",
            distance=round(random.uniform(5.0, 15.0), 1),
            estimated_time=random.randint(15, 35),
            traffic_level="Low"
        ),
        AlternateRoute(
            route_name="Main Street Route",
            distance=round(random.uniform(4.0, 12.0), 1),
            estimated_time=random.randint(20, 40),
            traffic_level="Medium"
        ),
        AlternateRoute(
            route_name="Bypass Road",
            distance=round(random.uniform(6.0, 18.0), 1),
            estimated_time=random.randint(18, 38),
            traffic_level="Low"
        )
    ]
    
    recommendations = [
        "Consider taking alternate route to save time",
        "Traffic expected to clear in 25-30 minutes",
        "Best time to travel: After 7:00 PM"
    ]
    
    return TrafficPredictionResponse(
        location=location.location_name,
        current_traffic_level=random.randint(60, 90),
        traffic_reason=random.choice(traffic_reasons),
        prediction_confidence=round(random.uniform(0.75, 0.98), 2),
        traffic_data=traffic_data,
        alternate_routes=alternate_routes,
        recommendations=recommendations
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
