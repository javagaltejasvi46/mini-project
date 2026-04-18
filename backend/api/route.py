from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import RouteResponse
from ml.orchestrator import MLPipelineOrchestrator
from clients.osmnx_client import OSMnxClient
from config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

ml_orchestrator = MLPipelineOrchestrator(
    settings.TABNET_MODEL_PATH,
    settings.GNN_MODEL_PATH
)

@router.get("/route", response_model=RouteResponse)
async def calculate_route(
    source_lat: float = Query(..., ge=-90, le=90),
    source_lon: float = Query(..., ge=-180, le=180),
    dest_lat: float = Query(..., ge=-90, le=90),
    dest_lon: float = Query(..., ge=-180, le=180),
    db: Session = Depends(get_db)
):
    if source_lat == dest_lat and source_lon == dest_lon:
        raise HTTPException(status_code=400, detail="Source and destination must be different")
    
    center_lat = (source_lat + dest_lat) / 2
    center_lon = (source_lon + dest_lon) / 2
    
    try:
        road_network = OSMnxClient.get_road_network(
            center_lat,
            center_lon,
            radius_m=10000
        )
    except Exception as e:
        logger.error(f"Failed to fetch road network: {e}")
        raise HTTPException(status_code=400, detail="No road network available for this location")
    
    spatial_predictions = {node: 0.5 for node in road_network.nodes()}
    
    try:
        routes = await ml_orchestrator.run_routing_pipeline(
            source=(source_lat, source_lon),
            destination=(dest_lat, dest_lon),
            road_network=road_network,
            spatial_predictions=spatial_predictions
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return RouteResponse(
        routes=routes,
        optimal_route=routes[0] if routes else {},
        estimated_time=routes[0]["estimated_time"] if routes else 0,
        distance=routes[0]["distance"] if routes else 0
    )
