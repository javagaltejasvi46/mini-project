"""
User Feedback API for Reinforcement Learning
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import UserFeedback, Prediction, ModelPerformance
from schemas import UserFeedbackRequest, UserFeedbackResponse, ModelPerformanceResponse
from ml.reinforcement_learning import rl_learner
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/feedback", response_model=UserFeedbackResponse)
async def submit_feedback(
    request: UserFeedbackRequest,
    db: Session = Depends(get_db)
):
    """
    Submit user feedback for a prediction
    This triggers reinforcement learning to improve the model
    """
    
    # Verify prediction exists
    prediction = db.query(Prediction).filter(
        Prediction.id == request.prediction_id
    ).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    # Create user location point if provided
    user_location = None
    if request.user_latitude and request.user_longitude:
        user_location = f'POINT({request.user_longitude} {request.user_latitude})'
    
    # Store feedback in database
    feedback = UserFeedback(
        prediction_id=request.prediction_id,
        accuracy_rating=request.accuracy_rating,
        usefulness_rating=request.usefulness_rating,
        actual_delay=request.actual_delay,
        actual_cause=request.actual_cause,
        comments=request.comments,
        was_helpful=request.was_helpful,
        user_location=user_location
    )
    
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    
    logger.info(f"Feedback received: ID={feedback.id}, Accuracy={request.accuracy_rating}, Usefulness={request.usefulness_rating}")
    
    # Prepare features for RL (need to reconstruct from prediction)
    # In production, you'd store features with prediction
    features = _reconstruct_features(prediction, db)
    
    # Add to reinforcement learning buffer
    rl_result = rl_learner.add_feedback(
        prediction_id=request.prediction_id,
        features=features,
        predicted_cause=prediction.cause,
        predicted_delay=prediction.delay,
        accuracy_rating=request.accuracy_rating,
        usefulness_rating=request.usefulness_rating,
        actual_delay=request.actual_delay,
        actual_cause=request.actual_cause
    )
    
    # Log reward
    logger.info(f"RL Reward: {rl_result['reward']:.3f}, Quality: {rl_result['feedback_quality']}")
    
    # Check if we should trigger retraining
    model_updated = False
    if rl_result['should_retrain']:
        logger.info("Feedback buffer full - triggering model update")
        # In production, this would trigger async retraining
        # For now, just log the adjustments
        adjustments = rl_learner.get_training_adjustments()
        logger.info(f"Training adjustments: {adjustments}")
        
        # Store performance metrics
        _store_performance_metrics(db, adjustments)
        
        model_updated = True
    
    return UserFeedbackResponse(
        feedback_id=feedback.id,
        message="Thank you for your feedback! This helps improve our predictions.",
        reward_applied=True,
        model_updated=model_updated
    )

@router.get("/feedback/stats")
async def get_feedback_stats(db: Session = Depends(get_db)):
    """Get aggregated feedback statistics"""
    
    metrics = rl_learner.get_performance_metrics(db)
    
    return {
        "status": "success",
        "metrics": metrics,
        "buffer_size": len(rl_learner.feedback_buffer),
        "buffer_capacity": rl_learner.buffer_size
    }

@router.get("/model/performance", response_model=list[ModelPerformanceResponse])
async def get_model_performance(db: Session = Depends(get_db)):
    """Get model performance metrics over time"""
    
    # Get latest performance for each model type
    latest_performances = []
    
    for model_type in ['tabnet_cause', 'tabnet_delay', 'gnn']:
        perf = db.query(ModelPerformance).filter(
            ModelPerformance.model_type == model_type
        ).order_by(ModelPerformance.timestamp.desc()).first()
        
        if perf:
            latest_performances.append(ModelPerformanceResponse(
                model_type=perf.model_type,
                accuracy=perf.accuracy,
                mae=perf.mae,
                avg_user_rating=perf.avg_user_rating,
                total_feedback_count=perf.total_feedback_count,
                last_updated=perf.timestamp
            ))
    
    return latest_performances

def _reconstruct_features(prediction: Prediction, db: Session):
    """Reconstruct feature vector from prediction"""
    import numpy as np
    from models import TrafficData
    
    # Get associated traffic data
    if prediction.traffic_data_id:
        traffic = db.query(TrafficData).filter(
            TrafficData.id == prediction.traffic_data_id
        ).first()
        
        if traffic:
            # Extract coordinates
            coords = db.query(
                func.ST_Y(traffic.location).label('latitude'),
                func.ST_X(traffic.location).label('longitude')
            ).filter(TrafficData.id == traffic.id).first()
            
            lat = coords.latitude if coords else 12.97
            lon = coords.longitude if coords else 77.59
            hour = traffic.timestamp.hour if traffic.timestamp else 12
            
            return np.array([[
                lat, lon,
                traffic.current_speed,
                traffic.congestion_ratio,
                traffic.rain,
                float(traffic.accident),
                float(traffic.event),
                hour
            ]])
    
    # Fallback: default features
    return np.zeros((1, 8))

def _store_performance_metrics(db: Session, adjustments: dict):
    """Store performance metrics in database"""
    
    perf = ModelPerformance(
        model_type='tabnet_combined',
        avg_user_rating=adjustments.get('avg_reward', 0) * 2.5 + 2.5,  # Convert -1,1 to 0,5
        total_feedback_count=adjustments.get('total_feedback', 0),
        positive_feedback_count=adjustments.get('good_predictions_count', 0),
        notes=f"Focus areas: {adjustments.get('focus_areas', {})}"
    )
    
    db.add(perf)
    db.commit()
    
    logger.info(f"Performance metrics stored: {perf.model_type}")
