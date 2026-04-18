import networkx as nx
import numpy as np
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class AStarRouter:
    def find_optimal_routes(
        self,
        graph: nx.Graph,
        source: Tuple[float, float],
        destination: Tuple[float, float],
        traffic_predictions: Dict[int, float],
        num_routes: int = 3
    ) -> List[Dict]:
        routes = []
        
        try:
            source_node = self._nearest_node(graph, source)
            dest_node = self._nearest_node(graph, destination)
            weighted_graph = self._apply_traffic_weights(graph, traffic_predictions)
            
            path = nx.astar_path(
                weighted_graph,
                source_node,
                dest_node,
                heuristic=lambda n1, n2: self._haversine_heuristic(graph, n1, n2),
                weight='travel_time'
            )
            
            route = self._path_to_route(graph, path, traffic_predictions)
            routes.append(route)
            
            for i in range(1, num_routes):
                alt_graph = weighted_graph.copy()
                edges_to_remove = path[len(path)//3 : 2*len(path)//3]
                for j in range(len(edges_to_remove)-1):
                    if alt_graph.has_edge(edges_to_remove[j], edges_to_remove[j+1]):
                        alt_graph.remove_edge(edges_to_remove[j], edges_to_remove[j+1])
                
                try:
                    alt_path = nx.astar_path(
                        alt_graph,
                        source_node,
                        dest_node,
                        heuristic=lambda n1, n2: self._haversine_heuristic(graph, n1, n2),
                        weight='travel_time'
                    )
                    alt_route = self._path_to_route(graph, alt_path, traffic_predictions)
                    routes.append(alt_route)
                except nx.NetworkXNoPath:
                    break
                    
        except nx.NetworkXNoPath:
            raise ValueError("No path found between source and destination")
        
        return routes
    
    def _nearest_node(self, graph: nx.Graph, location: Tuple[float, float]) -> int:
        nodes = list(graph.nodes(data=True))
        min_dist = float('inf')
        nearest = nodes[0][0]
        
        for node, data in nodes:
            if 'y' in data and 'x' in data:
                dist = ((data['y'] - location[0])**2 + (data['x'] - location[1])**2)**0.5
                if dist < min_dist:
                    min_dist = dist
                    nearest = node
        
        return nearest
    
    def _apply_traffic_weights(self, graph: nx.Graph, traffic_predictions: Dict[int, float]) -> nx.Graph:
        weighted = graph.copy()
        for u, v, data in weighted.edges(data=True):
            base_time = data.get('length', 100) / 50
            traffic_factor = traffic_predictions.get(u, 1.0)
            data['travel_time'] = base_time * (1 + traffic_factor)
        return weighted
    
    def _haversine_heuristic(self, graph: nx.Graph, node1: int, node2: int) -> float:
        try:
            n1_data = graph.nodes[node1]
            n2_data = graph.nodes[node2]
            lat1, lon1 = n1_data.get('y', 0), n1_data.get('x', 0)
            lat2, lon2 = n2_data.get('y', 0), n2_data.get('x', 0)
            return ((lat2 - lat1)**2 + (lon2 - lon1)**2)**0.5 * 111
        except:
            return 0
    
    def _path_to_route(self, graph: nx.Graph, path: List[int], traffic_predictions: Dict[int, float]) -> Dict:
        total_distance = 0
        total_time = 0
        avg_traffic = 0
        
        for i in range(len(path) - 1):
            if graph.has_edge(path[i], path[i+1]):
                edge_data = graph[path[i]][path[i+1]]
                if isinstance(edge_data, dict):
                    total_distance += edge_data.get('length', 0)
                    total_time += edge_data.get('travel_time', 0)
                avg_traffic += traffic_predictions.get(path[i], 0)
        
        avg_traffic /= len(path) if path else 1
        
        return {
            "path": path,
            "distance": total_distance / 1000,
            "estimated_time": total_time / 60,
            "traffic_level": "Low" if avg_traffic < 0.3 else "Medium" if avg_traffic < 0.7 else "High"
        }
