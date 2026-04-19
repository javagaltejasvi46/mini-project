"""
Routes API - Find and predict traffic on multiple routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import RouteFindRequest, RouteFindResponse
from clients.osmnx_client import OSMnxClient
import logging
import networkx as nx
from typing import List, Tuple
import numpy as np

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/routes/find", response_model=RouteFindResponse)
async def find_routes(
    request: RouteFindRequest,
    db: Session = Depends(get_db)
):
    """
    Find multiple routes between start and end points
    Uses GNN to predict traffic on each route
    """
    
    try:
        # Calculate center point and radius
        center_lat = (request.start_lat + request.end_lat) / 2
        center_lon = (request.start_lon + request.end_lon) / 2
        
        # Calculate distance for radius
        import math
        lat_diff = abs(request.start_lat - request.end_lat)
        lon_diff = abs(request.start_lon - request.end_lon)
        distance = math.sqrt(lat_diff**2 + lon_diff**2) * 111  # Rough km conversion
        radius = max(5000, int(distance * 1000 * 1.5))  # 1.5x distance as radius
        
        logger.info(f"Fetching road network: center=({center_lat}, {center_lon}), radius={radius}m")
        
        # Get road network
        try:
            G = OSMnxClient.get_road_network(center_lat, center_lon, radius_m=radius)
        except Exception as e:
            logger.error(f"Failed to fetch road network: {e}")
            raise HTTPException(status_code=400, detail="Could not fetch road network for this area")
        
        logger.info(f"Road network: {len(G.nodes())} nodes, {len(G.edges())} edges")
        
        # Find nearest nodes to start and end points
        start_node = OSMnxClient.get_nearest_node(G, request.start_lat, request.start_lon)
        end_node = OSMnxClient.get_nearest_node(G, request.end_lat, request.end_lon)
        
        if start_node is None or end_node is None:
            raise HTTPException(status_code=400, detail="Could not find road nodes near the specified points")
        
        logger.info(f"Start node: {start_node}, End node: {end_node}")
        
        # Find multiple routes using different algorithms
        routes = []
        
        # Route 1: Shortest path by distance
        try:
            route1_nodes = nx.shortest_path(G, start_node, end_node, weight='length')
            route1 = _process_route(G, route1_nodes, "shortest")
            
            if route1['distance'] == 0:
                logger.warning(f"Route 1 has zero distance! Nodes: {len(route1_nodes)}, checking edges...")
                # Debug: check if edges exist
                for i in range(min(3, len(route1_nodes)-1)):
                    if G.has_edge(route1_nodes[i], route1_nodes[i+1]):
                        edge_data = G[route1_nodes[i]][route1_nodes[i+1]]
                        logger.warning(f"Edge {i}: {edge_data}")
            
            routes.append(route1)
            logger.info(f"Route 1 (shortest): {len(route1_nodes)} nodes, {route1['distance']:.2f} km")
        except nx.NetworkXNoPath:
            logger.warning("No path found between points")
            raise HTTPException(status_code=400, detail="No route found between these points")
        
        # Route 2 & 3: Find alternative paths using penalty method
        # Try to find up to 2 more alternative routes
        for alt_num in range(1, 3):
            try:
                G_alt = G.copy()
                
                # Increase penalty on route 1 edges to find alternatives
                penalty_factor = 1.5 * alt_num  # Increase penalty for each alternative
                
                for i in range(len(route1_nodes) - 1):
                    u, v = route1_nodes[i], route1_nodes[i + 1]
                    if G_alt.has_edge(u, v):
                        # Get all edges between u and v
                        edge_data = G_alt.get_edge_data(u, v)
                        if edge_data:
                            # Apply penalty to all edges
                            for key in edge_data:
                                if isinstance(edge_data[key], dict):
                                    original_length = edge_data[key].get('length', 100)
                                    edge_data[key]['length'] = original_length * penalty_factor
                
                # Find path with penalized edges
                alt_nodes = nx.shortest_path(G_alt, start_node, end_node, weight='length')
                
                # Check if route is different enough
                if alt_nodes != route1_nodes and len(alt_nodes) > 5:
                    alt_route = _process_route(G, alt_nodes, f"alternative_{alt_num}")
                    
                    # Only add if distance is valid and different
                    if alt_route['distance'] > 0 and abs(alt_route['distance'] - route1['distance']) > 0.1:
                        routes.append(alt_route)
                        logger.info(f"Route {len(routes)} (alternative): {len(alt_nodes)} nodes, {alt_route['distance']:.2f} km")
                        
            except (nx.NetworkXNoPath, Exception) as e:
                logger.info(f"Could not find alternative route {alt_num}: {e}")
                break  # Stop trying if no more alternatives
        
        # Predict traffic on each route using GNN (simplified for now)
        for i, route in enumerate(routes):
            # Use simple heuristic for traffic prediction
            # In production, this would use the trained GNN model
            traffic_level, cause = _predict_route_traffic(route, i)
            route['traffic_level'] = traffic_level
            route['traffic_cause'] = cause
            route['predicted_delay'] = (traffic_level / 100) * route['estimated_time'] * 0.5
        
        # Sort routes by total time (estimated + delay)
        routes.sort(key=lambda r: r['estimated_time'] + r['predicted_delay'])
        
        # Add recommendations and time savings
        best_time = routes[0]['estimated_time'] + routes[0]['predicted_delay']
        
        for i, route in enumerate(routes):
            total_time = route['estimated_time'] + route['predicted_delay']
            time_diff = total_time - best_time
            
            if i == 0:
                # Best route
                if len(routes) > 1:
                    second_best_time = routes[1]['estimated_time'] + routes[1]['predicted_delay']
                    time_saved = second_best_time - best_time
                    route['recommendation'] = f"⭐ Best route! Saves {time_saved:.1f} min compared to alternatives. {route['traffic_cause']}"
                else:
                    route['recommendation'] = f"⭐ Recommended route. {route['traffic_cause']}"
            else:
                # Not the best route - explain why
                route['recommendation'] = f"⚠️ {time_diff:.1f} min slower than best route. {route['traffic_cause']}"
        
        return RouteFindResponse(
            routes=routes,
            total_routes=len(routes)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error finding routes: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to find routes: {str(e)}")

def _process_route(G: nx.Graph, nodes: List, route_type: str) -> dict:
    """Process route nodes into route information"""
    
    # Extract coordinates
    coordinates = []
    total_distance = 0
    
    for i, node in enumerate(nodes):
        node_data = G.nodes[node]
        lat = node_data.get('y', 0)
        lon = node_data.get('x', 0)
        coordinates.append([lat, lon])
        
        # Calculate distance using NetworkX path length
        if i > 0:
            prev_node = nodes[i-1]
            try:
                # Use NetworkX to get edge length directly
                edge_length = nx.shortest_path_length(G, prev_node, node, weight='length')
                total_distance += edge_length
            except:
                # Fallback: try to get edge data directly
                if G.has_edge(prev_node, node):
                    edge_data = G.get_edge_data(prev_node, node)
                    if edge_data:
                        # Handle MultiDiGraph structure
                        if isinstance(edge_data, dict):
                            # Get first edge if multiple exist
                            if 0 in edge_data:
                                total_distance += edge_data[0].get('length', 0)
                            else:
                                first_key = list(edge_data.keys())[0]
                                if isinstance(edge_data[first_key], dict):
                                    total_distance += edge_data[first_key].get('length', 0)
                                else:
                                    total_distance += edge_data.get('length', 0)
    
    # Convert distance to km
    distance_km = total_distance / 1000
    
    # Estimate time (assuming average speed of 30 km/h in city)
    estimated_time = (distance_km / 30) * 60 if distance_km > 0 else 1  # minutes
    
    return {
        'coordinates': coordinates,
        'distance': distance_km,
        'estimated_time': estimated_time,
        'route_type': route_type,
        'traffic_level': 0,  # Will be filled by prediction
        'predicted_delay': 0,  # Will be filled by prediction
        'traffic_cause': '',  # Will be filled by prediction
        'recommendation': ''  # Will be filled after comparison
    }

def _predict_route_traffic(route: dict, route_index: int) -> tuple:
    """
    Predict traffic level and cause for a route using GNN
    For now, uses simple heuristics. In production, use trained GNN model.
    
    Returns:
        tuple: (traffic_level: int, cause: str)
    """
    
    # Simple heuristic based on route characteristics
    base_traffic = 40  # Base traffic level
    
    # Longer routes tend to have more traffic
    distance_factor = min(route['distance'] * 2, 20)
    
    # Alternative routes might have less traffic
    route_factor = -10 if route_index > 0 else 0
    
    # Add some randomness
    import random
    random_factor = random.randint(-10, 10)
    
    traffic_level = int(base_traffic + distance_factor + route_factor + random_factor)
    traffic_level = max(10, min(90, traffic_level))  # Clamp between 10-90
    
    # Determine cause based on traffic level and route characteristics
    import datetime
    hour = datetime.datetime.now().hour
    
    if traffic_level < 30:
        cause = "Light traffic - smooth flow expected"
    elif traffic_level < 50:
        if 7 <= hour <= 10 or 17 <= hour <= 20:
            cause = "Moderate traffic due to rush hour"
        else:
            cause = "Moderate traffic - normal city conditions"
    elif traffic_level < 70:
        if route['distance'] > 10:
            cause = "Heavy traffic on long route - consider alternatives"
        elif 7 <= hour <= 10 or 17 <= hour <= 20:
            cause = "Heavy rush hour traffic expected"
        else:
            cause = "Heavy traffic - possible congestion or events"
    else:
        if 7 <= hour <= 10 or 17 <= hour <= 20:
            cause = "Severe rush hour congestion - significant delays expected"
        else:
            cause = "Severe traffic - possible accident or road work"
    
    return traffic_level, cause
