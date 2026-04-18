import numpy as np
from typing import List, Dict, Tuple
import networkx as nx
from models import TrafficData
from .tabnet_predictor import TabNetPredictor
from .gnn_predictor import GNNPredictor
from .astar_router import AStarRouter

class MLPipelineOrchestrator:
    def __init__(self, tabnet_model_path: str, gnn_model_path: str):
        self.tabnet = TabNetPredictor(tabnet_model_path)
        self.gnn = GNNPredictor(gnn_model_path)
        self.router = AStarRouter()
    
    async def run_prediction_pipeline(
        self,
        lat: float,
        lon: float,
        traffic_data: List[TrafficData],
        road_network: nx.Graph
    ) -> Dict:
        features = self._prepare_tabnet_features(traffic_data)
        cause, delay = self.tabnet.predict_cause_and_delay(features)
        
        node_features = self._prepare_gnn_features(traffic_data, road_network)
        spatial_predictions = self.gnn.predict_spatial_traffic(road_network, node_features)
        
        return {
            "cause": cause,
            "delay": delay,
            "spatial_predictions": spatial_predictions
        }
    
    async def run_routing_pipeline(
        self,
        source: Tuple[float, float],
        destination: Tuple[float, float],
        road_network: nx.Graph,
        spatial_predictions: Dict[int, float]
    ) -> List[Dict]:
        routes = self.router.find_optimal_routes(
            road_network,
            source,
            destination,
            spatial_predictions,
            num_routes=3
        )
        return routes
    
    def _prepare_tabnet_features(self, traffic_data: List[TrafficData]) -> np.ndarray:
        """
        Prepare features for TabNet prediction
        Features: [latitude, longitude, speed, congestion, rain, accident, event, hour]
        """
        if not traffic_data:
            # Return default features if no data
            return np.zeros((1, 8))
        
        latest = traffic_data[0]
        
        # Extract location coordinates using scalar queries
        from sqlalchemy import func
        from database import db_manager
        
        with db_manager.get_session() as session:
            # Query the coordinates separately
            result = session.execute(
                func.ST_AsText(latest.location)
            ).scalar()
            
            if result:
                # Parse POINT(lon lat) format
                coords = result.replace('POINT(', '').replace(')', '').split()
                lon = float(coords[0])
                lat = float(coords[1])
            else:
                lat = 12.97
                lon = 77.59
        
        # Extract hour from timestamp
        hour = latest.timestamp.hour if latest.timestamp else 12
        
        return np.array([[
            lat,
            lon,
            latest.current_speed,
            latest.congestion_ratio,
            latest.rain,
            float(latest.accident),
            float(latest.event),
            hour
        ]])
    
    def _prepare_gnn_features(
        self, 
        traffic_data: List[TrafficData], 
        road_network: nx.Graph
    ) -> Dict[int, np.ndarray]:
        node_features = {}
        for node in road_network.nodes():
            node_features[node] = np.array([0.5, 0.0, 0.0])
        return node_features
