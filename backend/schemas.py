from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class PredictionRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    location_name: str

class TrafficDataPoint(BaseModel):
    time: str
    traffic_level: int
    speed: float

class PredictionResponse(BaseModel):
    prediction_id: Optional[int] = None
    location: str
    current_traffic_level: int
    traffic_reason: str
    prediction_confidence: float
    predicted_delay: float
    cause: str
    traffic_data: List[TrafficDataPoint]
    alternate_routes: List[Dict[str, Any]]
    recommendations: List[str]

class TrafficDataResponse(BaseModel):
    id: int
    lat: float
    lon: float
    timestamp: datetime
    current_speed: float
    congestion_ratio: float
    rain: float
    accident: bool
    event: bool
    
    class Config:
        from_attributes = True

class UserFeedbackRequest(BaseModel):
    prediction_id: int
    accuracy_rating: int = Field(..., ge=1, le=5, description="Rate accuracy 1-5")
    usefulness_rating: int = Field(..., ge=1, le=5, description="Rate usefulness 1-5")
    actual_delay: Optional[float] = Field(None, description="Actual delay in minutes")
    actual_cause: Optional[str] = None
    comments: Optional[str] = None
    was_helpful: bool = True
    user_latitude: Optional[float] = None
    user_longitude: Optional[float] = None

class UserFeedbackResponse(BaseModel):
    feedback_id: int
    message: str
    reward_applied: bool
    model_updated: bool

class ModelPerformanceResponse(BaseModel):
    model_type: str
    accuracy: Optional[float]
    mae: Optional[float]
    avg_user_rating: Optional[float]
    total_feedback_count: int
    last_updated: datetime

class TrafficRequest(BaseModel):
    lat: float
    lon: float
    radius: int = 5000

class RouteRequest(BaseModel):
    start_lat: float
    start_lon: float
    end_lat: float
    end_lon: float

class RouteResponse(BaseModel):
    routes: List[Dict[str, Any]]
    optimal_route: Dict[str, Any]
    estimated_time: float
    distance: float

class RouteFindRequest(BaseModel):
    start_lat: float = Field(..., ge=-90, le=90)
    start_lon: float = Field(..., ge=-180, le=180)
    end_lat: float = Field(..., ge=-90, le=90)
    end_lon: float = Field(..., ge=-180, le=180)

class RouteInfo(BaseModel):
    coordinates: List[List[float]]
    distance: float
    estimated_time: float
    route_type: str
    traffic_level: int
    predicted_delay: float
    traffic_cause: str
    recommendation: str

class RouteFindResponse(BaseModel):
    routes: List[RouteInfo]
    total_routes: int
