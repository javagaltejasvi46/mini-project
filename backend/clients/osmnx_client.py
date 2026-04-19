import osmnx as ox
import networkx as nx
from typing import Tuple, Optional

class OSMnxClient:
    @staticmethod
    def get_road_network(lat: float, lon: float, radius_m: float = 1000) -> nx.MultiDiGraph:
        point = (lat, lon)
        graph = ox.graph_from_point(point, dist=radius_m, network_type='drive')
        return graph
    
    @staticmethod
    def get_nearest_node(G: nx.MultiDiGraph, lat: float, lon: float) -> Optional[int]:
        """Find the nearest node in the graph to the given coordinates"""
        try:
            nearest_node = ox.distance.nearest_nodes(G, lon, lat)
            return nearest_node
        except Exception as e:
            print(f"Error finding nearest node: {e}")
            return None
