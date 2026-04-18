import numpy as np
import networkx as nx
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class GNNPredictor:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        try:
            self.model = self._load_model(model_path)
        except Exception as e:
            logger.warning(f"Could not load GNN model: {e}. Using fallback predictions.")
    
    def predict_spatial_traffic(
        self,
        graph: nx.Graph,
        node_features: Dict[int, np.ndarray]
    ) -> Dict[int, float]:
        predictions = {}
        for node_id, features in node_features.items():
            if self.model is None:
                predictions[node_id] = self._fallback_prediction(features)
            else:
                try:
                    predictions[node_id] = float(self.model.predict_node(graph, node_id, features))
                except:
                    predictions[node_id] = self._fallback_prediction(features)
        return predictions
    
    def _fallback_prediction(self, features: np.ndarray) -> float:
        return float(np.mean(features))
    
    def _load_model(self, path: str):
        return None
