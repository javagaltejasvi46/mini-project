import osmnx as ox
import networkx as nx
from typing import Tuple

class OSMnxClient:
    @staticmethod
    def get_road_network(lat: float, lon: float, radius_m: float = 1000) -> nx.MultiDiGraph:
        point = (lat, lon)
        graph = ox.graph_from_point(point, dist=radius_m, network_type='drive')
        return graph
