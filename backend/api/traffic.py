from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import TrafficData
from schemas import TrafficDataResponse

router = APIRouter()

@router.get("/traffic", response_model=List[TrafficDataResponse])
async def get_traffic_data(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(default=1.0, ge=0.1, le=50),
    db: Session = Depends(get_db)
):
    query_point = f'POINT({lon} {lat})'
    
    results = db.query(TrafficData).filter(
        func.ST_DWithin(
            TrafficData.location,
            func.ST_GeogFromText(query_point),
            radius_km * 1000
        )
    ).order_by(
        func.ST_Distance(TrafficData.location, func.ST_GeogFromText(query_point))
    ).limit(50).all()
    
    response_data = []
    for r in results:
        lat_val = db.scalar(func.ST_Y(func.ST_AsText(r.location)))
        lon_val = db.scalar(func.ST_X(func.ST_AsText(r.location)))
        response_data.append(TrafficDataResponse(
            id=r.id,
            lat=lat_val,
            lon=lon_val,
            timestamp=r.timestamp,
            current_speed=r.current_speed,
            congestion_ratio=r.congestion_ratio,
            rain=r.rain,
            accident=r.accident,
            event=r.event
        ))
    
    return response_data
