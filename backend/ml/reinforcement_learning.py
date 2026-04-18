"""
Reinforcement Learning Module for SmartRoute AI
Implements online learning from user feedback
"""

import numpy as np
import logging
from typing import Dict, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

logger = logging.getLogger(__name__)

class ReinforcementLearner:
    """
    Implements reinforcement learning to update models based on user feedback
    Uses reward-based learning to improve predictions over time
    """
    
    def __init__(self, learning_rate: float = 0.01):
        self.learning_rate = learning_rate
        self.feedback_buffer = []
        self.buffer_size = 100  # Retrain after 100 feedback samples
        
    def calculate_reward(
        self,
        accuracy_rating: int,
        usefulness_rating: int,
        actual_delay: float = None,
        predicted_delay: float = None
    ) -> float:
        """
        Calculate reward signal from user feedback
        
        Args:
            accuracy_rating: User rating 1-5
            usefulness_rating: User rating 1-5
            actual_delay: Actual delay reported by user
            predicted_delay: Model's predicted delay
        
        Returns:
            Reward value between -1 and 1
        """
        # Base reward from ratings (normalized to -1 to 1)
        rating_reward = ((accuracy_rating + usefulness_rating) / 10 - 0.5) * 2
        
        # Additional reward/penalty from delay accuracy
        if actual_delay is not None and predicted_delay is not None:
            delay_error = abs(actual_delay - predicted_delay)
            
            # Penalty increases with error
            if delay_error < 5:
                delay_reward = 0.2  # Good prediction
            elif delay_error < 10:
                delay_reward = 0.0  # Acceptable
            elif delay_error < 20:
                delay_reward = -0.2  # Poor
            else:
                delay_reward = -0.5  # Very poor
            
            # Combine rewards (70% rating, 30% delay accuracy)
            total_reward = 0.7 * rating_reward + 0.3 * delay_reward
        else:
            total_reward = rating_reward
        
        return np.clip(total_reward, -1.0, 1.0)
    
    def add_feedback(
        self,
        prediction_id: int,
        features: np.ndarray,
        predicted_cause: str,
        predicted_delay: float,
        accuracy_rating: int,
        usefulness_rating: int,
        actual_delay: float = None,
        actual_cause: str = None
    ) -> Dict:
        """
        Add user feedback to buffer and calculate reward
        
        Returns:
            Dictionary with reward info and whether retraining is triggered
        """
        reward = self.calculate_reward(
            accuracy_rating,
            usefulness_rating,
            actual_delay,
            predicted_delay
        )
        
        feedback_entry = {
            'prediction_id': prediction_id,
            'features': features,
            'predicted_cause': predicted_cause,
            'predicted_delay': predicted_delay,
            'actual_delay': actual_delay,
            'actual_cause': actual_cause,
            'reward': reward,
            'timestamp': datetime.utcnow()
        }
        
        self.feedback_buffer.append(feedback_entry)
        
        logger.info(f"Feedback added: Reward={reward:.3f}, Buffer size={len(self.feedback_buffer)}")
        
        # Check if we should trigger retraining
        should_retrain = len(self.feedback_buffer) >= self.buffer_size
        
        return {
            'reward': reward,
            'buffer_size': len(self.feedback_buffer),
            'should_retrain': should_retrain,
            'feedback_quality': 'positive' if reward > 0 else 'negative'
        }
    
    def get_training_adjustments(self) -> Dict:
        """
        Analyze feedback buffer and suggest training adjustments
        
        Returns:
            Dictionary with suggested adjustments for model training
        """
        if not self.feedback_buffer:
            return {}
        
        rewards = [f['reward'] for f in self.feedback_buffer]
        avg_reward = np.mean(rewards)
        
        # Analyze which predictions need improvement
        poor_predictions = [f for f in self.feedback_buffer if f['reward'] < -0.2]
        good_predictions = [f for f in self.feedback_buffer if f['reward'] > 0.2]
        
        adjustments = {
            'avg_reward': avg_reward,
            'total_feedback': len(self.feedback_buffer),
            'poor_predictions_count': len(poor_predictions),
            'good_predictions_count': len(good_predictions),
            'needs_improvement': avg_reward < 0,
            'suggested_learning_rate': self.learning_rate * (1 + abs(avg_reward)),
            'focus_areas': self._identify_focus_areas(poor_predictions)
        }
        
        return adjustments
    
    def _identify_focus_areas(self, poor_predictions: list) -> Dict:
        """Identify which scenarios need improvement"""
        if not poor_predictions:
            return {}
        
        focus = {
            'high_congestion': 0,
            'low_congestion': 0,
            'with_rain': 0,
            'with_accidents': 0,
            'with_events': 0
        }
        
        for pred in poor_predictions:
            features = pred['features'][0]
            if len(features) >= 8:
                lat, lon, speed, congestion, rain, accident, event, hour = features[:8]
                
                if congestion > 3.0:
                    focus['high_congestion'] += 1
                elif congestion < 1.5:
                    focus['low_congestion'] += 1
                
                if rain > 2.0:
                    focus['with_rain'] += 1
                if accident > 0:
                    focus['with_accidents'] += 1
                if event > 0:
                    focus['with_events'] += 1
        
        return focus
    
    def prepare_retraining_data(self) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Prepare data from feedback buffer for model retraining
        
        Returns:
            Tuple of (features, cause_labels, delay_labels) with sample weights
        """
        if not self.feedback_buffer:
            return None, None, None
        
        features_list = []
        cause_labels = []
        delay_labels = []
        sample_weights = []
        
        for feedback in self.feedback_buffer:
            features_list.append(feedback['features'][0])
            
            # Use actual values if provided, otherwise use predicted
            if feedback['actual_cause']:
                cause_labels.append(self._encode_cause(feedback['actual_cause']))
            else:
                cause_labels.append(self._encode_cause(feedback['predicted_cause']))
            
            if feedback['actual_delay'] is not None:
                delay_labels.append(feedback['actual_delay'])
            else:
                delay_labels.append(feedback['predicted_delay'])
            
            # Weight samples by reward (positive feedback gets higher weight)
            weight = 1.0 + feedback['reward']  # Range: 0 to 2
            sample_weights.append(max(0.1, weight))  # Minimum weight 0.1
        
        X = np.array(features_list)
        y_cause = np.array(cause_labels)
        y_delay = np.array(delay_labels)
        weights = np.array(sample_weights)
        
        logger.info(f"Prepared {len(X)} samples for retraining")
        logger.info(f"Sample weights range: {weights.min():.2f} - {weights.max():.2f}")
        
        return X, y_cause, y_delay, weights
    
    def _encode_cause(self, cause: str) -> int:
        """Encode cause string to integer label"""
        cause_map = {
            "Heavy rush hour traffic": 0,
            "Road construction ahead": 1,
            "Traffic accident reported": 2,
            "Special event in the area": 3,
            "Weather conditions affecting traffic": 4
        }
        return cause_map.get(cause, 0)
    
    def clear_buffer(self):
        """Clear feedback buffer after retraining"""
        self.feedback_buffer = []
        logger.info("Feedback buffer cleared")
    
    def get_performance_metrics(self, db: Session) -> Dict:
        """
        Calculate performance metrics from database feedback
        
        Args:
            db: Database session
        
        Returns:
            Dictionary with performance metrics
        """
        from models import UserFeedback, Prediction
        
        # Get recent feedback (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        
        recent_feedback = db.query(UserFeedback).filter(
            UserFeedback.timestamp >= week_ago
        ).all()
        
        if not recent_feedback:
            return {
                'total_feedback': 0,
                'avg_accuracy_rating': 0,
                'avg_usefulness_rating': 0,
                'positive_feedback_rate': 0
            }
        
        total = len(recent_feedback)
        avg_accuracy = np.mean([f.accuracy_rating for f in recent_feedback])
        avg_usefulness = np.mean([f.usefulness_rating for f in recent_feedback])
        positive_count = sum(1 for f in recent_feedback if f.was_helpful)
        
        # Calculate delay accuracy for feedback with actual delays
        delay_errors = []
        for feedback in recent_feedback:
            if feedback.actual_delay is not None:
                prediction = db.query(Prediction).filter(
                    Prediction.id == feedback.prediction_id
                ).first()
                if prediction:
                    error = abs(feedback.actual_delay - prediction.delay)
                    delay_errors.append(error)
        
        avg_delay_error = np.mean(delay_errors) if delay_errors else None
        
        return {
            'total_feedback': total,
            'avg_accuracy_rating': float(avg_accuracy),
            'avg_usefulness_rating': float(avg_usefulness),
            'positive_feedback_rate': positive_count / total,
            'avg_delay_error': float(avg_delay_error) if avg_delay_error else None,
            'feedback_with_actual_delay': len(delay_errors)
        }


# Global instance
rl_learner = ReinforcementLearner(learning_rate=0.01)
