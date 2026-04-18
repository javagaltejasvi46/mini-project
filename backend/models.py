from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSONB
from geoalchemy2 import Geography
from datetime import datetime

Base = declarative_base()

class TrafficData(Base):
    __tablename__ = "traffic_data"
    
    id = Column(Integer, primary_key=True, index=True)
    location = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    current_speed = Column(Float, nullable=False)
    congestion_ratio = Column(Float, nullable=False)
    rain = Column(Float, default=0.0)
    accident = Column(Boolean, default=False)
    event = Column(Boolean, default=False)
    road_segment_id = Column(Integer, ForeignKey("road_segments.id"), nullable=True)

class RoadSegment(Base):
    __tablename__ = "road_segments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    geometry = Column(Geography(geometry_type='LINESTRING', srid=4326), nullable=False)
    road_type = Column(String, nullable=True)
    speed_limit = Column(Float, nullable=True)

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    location = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    cause = Column(String, nullable=False)
    delay = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    traffic_data_id = Column(Integer, ForeignKey("traffic_data.id"), nullable=True)

class UserFeedback(Base):
    """Store user feedback for reinforcement learning"""
    __tablename__ = "user_feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # User ratings (1-5 scale)
    accuracy_rating = Column(Integer, nullable=False)  # How accurate was the prediction?
    usefulness_rating = Column(Integer, nullable=False)  # How useful was the information?
    
    # Actual vs predicted
    actual_delay = Column(Float, nullable=True)  # User-reported actual delay
    actual_cause = Column(String, nullable=True)  # User-reported actual cause
    
    # Additional feedback
    comments = Column(Text, nullable=True)
    was_helpful = Column(Boolean, default=True)
    
    # Metadata
    user_location = Column(Geography(geometry_type='POINT', srid=4326), nullable=True)
    device_info = Column(JSONB, nullable=True)

class ModelPerformance(Base):
    """Track model performance metrics over time"""
    __tablename__ = "model_performance"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    model_type = Column(String, nullable=False)  # 'tabnet_cause', 'tabnet_delay', 'gnn'
    
    # Performance metrics
    accuracy = Column(Float, nullable=True)
    mae = Column(Float, nullable=True)
    mse = Column(Float, nullable=True)
    
    # Feedback-based metrics
    avg_user_rating = Column(Float, nullable=True)
    total_feedback_count = Column(Integer, default=0)
    positive_feedback_count = Column(Integer, default=0)
    
    # Training info
    training_samples = Column(Integer, nullable=True)
    model_version = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
