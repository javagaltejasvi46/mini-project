import numpy as np
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

class TabNetPredictor:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        try:
            self.model = self._load_model(model_path)
        except Exception as e:
            logger.warning(f"Could not load TabNet model: {e}. Using fallback predictions.")
    
    def predict_cause_and_delay(self, traffic_features: np.ndarray) -> Tuple[str, float]:
        """
        Predict traffic cause and delay
        
        Args:
            traffic_features: Array with shape (1, 8) containing:
                [latitude, longitude, speed, congestion, rain, accident, event, hour]
        
        Returns:
            Tuple of (cause_description, delay_minutes)
        """
        if self.model is None:
            return self._fallback_prediction(traffic_features)
        
        try:
            prediction = self.model.predict(traffic_features)
            cause = self._decode_cause(int(prediction[0]))
            delay = float(prediction[1])
            return cause, delay
        except Exception as e:
            logger.error(f"TabNet prediction failed: {e}")
            return self._fallback_prediction(traffic_features)
    
    def _fallback_prediction(self, features: np.ndarray) -> Tuple[str, float]:
        """
        Fallback prediction using rule-based logic
        Features: [lat, lon, speed, congestion, rain, accident, event, hour]
        """
        # Extract features (handle both old and new format)
        if features.shape[1] >= 8:
            lat, lon, speed, congestion, rain, accident, event, hour = features[0][:8]
        else:
            # Old format compatibility
            speed, congestion, rain, accident, event = features[0][:5]
        
        if accident > 0:
            return "Traffic accident reported", congestion * 15
        elif event > 0:
            return "Special event in the area", congestion * 10
        elif rain > 2.0:
            return "Weather conditions affecting traffic", congestion * 8
        elif congestion > 3.0:
            return "Heavy rush hour traffic", congestion * 12
        else:
            return "Road construction ahead", congestion * 5
    
    def _load_model(self, path: str):
        # Placeholder - actual model loading would go here
        return None
    
    def _decode_cause(self, cause_code: int) -> str:
        causes = {
            0: "Heavy rush hour traffic",
            1: "Road construction ahead",
            2: "Traffic accident reported",
            3: "Special event in the area",
            4: "Weather conditions affecting traffic"
        }
        return causes.get(cause_code, "Unknown cause")
