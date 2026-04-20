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
from typing import List, Optional
import math
import random
import datetime
import functools

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------------------------------------------------------------------
# In-memory road network cache
# Key: (center_lat_rounded, center_lon_rounded, radius)
# Avoids re-downloading the same OSM tile on repeated requests
# ---------------------------------------------------------------------------
_network_cache: dict = {}
_CACHE_MAX = 20  # keep at most 20 tiles in memory

def _cache_key(lat: float, lon: float, radius: int) -> tuple:
    # Round to 2 decimal places (~1 km grid) so nearby requests reuse the same tile
    return (round(lat, 2), round(lon, 2), radius)

def _get_road_network(lat: float, lon: float, radius: int) -> nx.MultiDiGraph:
    key = _cache_key(lat, lon, radius)
    if key in _network_cache:
        logger.info(f"Road network cache HIT for {key}")
        return _network_cache[key]

    logger.info(f"Road network cache MISS — downloading OSM tile {key}")
    G = OSMnxClient.get_road_network(lat, lon, radius_m=radius)

    # Evict oldest entry if cache is full
    if len(_network_cache) >= _CACHE_MAX:
        oldest = next(iter(_network_cache))
        del _network_cache[oldest]

    _network_cache[key] = G
    return G


@router.post("/routes/find", response_model=RouteFindResponse)
async def find_routes(
    request: RouteFindRequest,
    db: Session = Depends(get_db)
):
    try:
        center_lat = (request.start_lat + request.end_lat) / 2
        center_lon = (request.start_lon + request.end_lon) / 2

        lat_diff = abs(request.start_lat - request.end_lat)
        lon_diff = abs(request.start_lon - request.end_lon)
        distance_km = math.sqrt(lat_diff**2 + lon_diff**2) * 111
        # Cap radius at 15 km — large tiles are the #1 cause of slowness
        radius = min(max(3000, int(distance_km * 1000 * 1.2)), 15000)

        logger.info(f"Fetching road network: center=({center_lat:.4f}, {center_lon:.4f}), radius={radius}m")

        try:
            G = _get_road_network(center_lat, center_lon, radius)
        except Exception as e:
            logger.error(f"Failed to fetch road network: {e}")
            raise HTTPException(status_code=400, detail="Could not fetch road network for this area")

        logger.info(f"Road network: {len(G.nodes())} nodes, {len(G.edges())} edges")

        start_node = OSMnxClient.get_nearest_node(G, request.start_lat, request.start_lon)
        end_node   = OSMnxClient.get_nearest_node(G, request.end_lat,   request.end_lon)

        if start_node is None or end_node is None:
            raise HTTPException(status_code=400, detail="Could not find road nodes near the specified points")

        routes = []

        # Route 1: shortest by distance
        try:
            route1_nodes = nx.shortest_path(G, start_node, end_node, weight='length')
            route1 = _process_route(G, route1_nodes, "shortest")
            routes.append(route1)
            logger.info(f"Route 1 (shortest): {len(route1_nodes)} nodes, {route1['distance']:.2f} km")
        except nx.NetworkXNoPath:
            raise HTTPException(status_code=400, detail="No route found between these points")

        # Routes 2 & 3: alternatives via edge-weight penalty
        # Use a lightweight subgraph view instead of full G.copy()
        for alt_num in range(1, 3):
            try:
                penalty_factor = 2.0 * alt_num
                # Build a weight function that penalises route-1 edges
                route1_edges = set(zip(route1_nodes[:-1], route1_nodes[1:]))

                def penalised_weight(u, v, data, edges=route1_edges, pf=penalty_factor):
                    base = min(d.get('length', 100) for d in data.values())
                    return base * pf if (u, v) in edges else base

                alt_nodes = nx.shortest_path(G, start_node, end_node, weight=penalised_weight)

                if alt_nodes != route1_nodes and len(alt_nodes) > 5:
                    alt_route = _process_route(G, alt_nodes, f"alternative_{alt_num}")
                    if alt_route['distance'] > 0 and abs(alt_route['distance'] - route1['distance']) > 0.1:
                        routes.append(alt_route)
                        logger.info(f"Route {len(routes)} (alt {alt_num}): {alt_route['distance']:.2f} km")

            except Exception as e:
                logger.info(f"Could not find alternative route {alt_num}: {e}")
                break

        # Traffic prediction
        for i, route in enumerate(routes):
            traffic_level, cause = _predict_route_traffic(route, i)
            route['traffic_level']   = traffic_level
            route['traffic_cause']   = cause
            route['predicted_delay'] = (traffic_level / 100) * route['estimated_time'] * 0.5

        routes.sort(key=lambda r: r['estimated_time'] + r['predicted_delay'])

        best_time = routes[0]['estimated_time'] + routes[0]['predicted_delay']
        for i, route in enumerate(routes):
            total_time = route['estimated_time'] + route['predicted_delay']
            time_diff  = total_time - best_time
            if i == 0:
                if len(routes) > 1:
                    second_best = routes[1]['estimated_time'] + routes[1]['predicted_delay']
                    saved = second_best - best_time
                    route['recommendation'] = f"⭐ Best route! Saves {saved:.1f} min vs alternatives. {route['traffic_cause']}"
                else:
                    route['recommendation'] = f"⭐ Recommended route. {route['traffic_cause']}"
            else:
                route['recommendation'] = f"⚠️ {time_diff:.1f} min slower than best route. {route['traffic_cause']}"

        return RouteFindResponse(routes=routes, total_routes=len(routes))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error finding routes: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to find routes: {str(e)}")


def _process_route(G: nx.MultiDiGraph, nodes: List, route_type: str) -> dict:
    """Extract coordinates and total distance from a node list.
    
    Uses direct edge data lookup (O(n)) instead of repeated Dijkstra calls.
    """
    coordinates = []
    total_distance = 0.0

    for i, node in enumerate(nodes):
        nd = G.nodes[node]
        coordinates.append([nd.get('y', 0), nd.get('x', 0)])

        if i > 0:
            prev = nodes[i - 1]
            edge_data = G.get_edge_data(prev, node)
            if edge_data:
                # MultiDiGraph: edge_data is {key: {attrs}}
                # Take the minimum-length parallel edge
                length = min(
                    (d.get('length', 0) for d in edge_data.values()),
                    default=0
                )
                total_distance += length

    distance_km    = total_distance / 1000
    estimated_time = (distance_km / 30) * 60 if distance_km > 0 else 1  # 30 km/h city avg

    return {
        'coordinates':    coordinates,
        'distance':       distance_km,
        'estimated_time': estimated_time,
        'route_type':     route_type,
        'traffic_level':  0,
        'predicted_delay': 0,
        'traffic_cause':  '',
        'recommendation': '',
    }


def _predict_route_traffic(route: dict, route_index: int) -> tuple:
    base_traffic    = 40
    distance_factor = min(route['distance'] * 2, 20)
    route_factor    = -10 if route_index > 0 else 0
    random_factor   = random.randint(-10, 10)

    traffic_level = int(base_traffic + distance_factor + route_factor + random_factor)
    traffic_level = max(10, min(90, traffic_level))

    hour = datetime.datetime.now().hour
    rush = 7 <= hour <= 10 or 17 <= hour <= 20

    if traffic_level < 30:
        cause = "Light traffic — smooth flow expected"
    elif traffic_level < 50:
        cause = "Moderate traffic due to rush hour" if rush else "Moderate traffic — normal city conditions"
    elif traffic_level < 70:
        if route['distance'] > 10:
            cause = "Heavy traffic on long route — consider alternatives"
        else:
            cause = "Heavy rush hour traffic expected" if rush else "Heavy traffic — possible congestion or events"
    else:
        cause = "Severe rush hour congestion — significant delays expected" if rush else "Severe traffic — possible accident or road work"

    return traffic_level, cause
