"""
TabNet Training Script for SmartRoute AI
Trains cause classifier and delay regressor
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error, classification_report
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def prepare_data(csv_file='training_data.csv'):
    """Load and prepare training data from CSV file"""
    
    logger.info(f"Loading data from {csv_file}...")
    
    # Try to load from CSV first
    if os.path.exists(csv_file):
        df = pd.read_csv(csv_file)
        logger.info(f"Loaded {len(df)} samples from CSV")
        
        # Extract features: latitude, longitude, speed, congestion, rain, accident, event, hour
        # NOTE: Using lat/lon for location, NOT location_name
        X = df[['latitude', 'longitude', 'current_speed', 'congestion_ratio', 
                'rain', 'accident', 'event', 'hour']].values
        
        # Extract labels
        y_cause = df['cause_label'].values
        y_delay = df['delay_minutes'].values
        
    else:
        # Fallback to database
        logger.info("CSV not found, loading from database...")
        from database import db_manager
        from models import TrafficData
        from sqlalchemy import func
        
        with db_manager.get_session() as session:
            # Query all traffic data with location
            data = session.query(
                func.ST_Y(TrafficData.location).label('latitude'),
                func.ST_X(TrafficData.location).label('longitude'),
                TrafficData.current_speed,
                TrafficData.congestion_ratio,
                TrafficData.rain,
                TrafficData.accident,
                TrafficData.event,
                func.extract('hour', TrafficData.timestamp).label('hour')
            ).all()
        
        if len(data) < 100:
            logger.error(f"Only {len(data)} samples in database. Need at least 100.")
            logger.error("Run: python generate_sample_dataset.py")
            raise ValueError("Insufficient training data")
        
        # Convert to arrays
        X = np.array([[d[0], d[1], d[2], d[3], d[4], float(d[5]), float(d[6]), d[7]] 
                      for d in data])
        
        # Generate labels using rule-based approach
        logger.warning("Using rule-based labels. For production, use actual labeled data!")
        
        y_cause = []
        y_delay = []
        
        for row in X:
            lat, lon, speed, congestion, rain, accident, event, hour = row
            
            if accident > 0:
                y_cause.append(2)
                y_delay.append(congestion * 15)
            elif event > 0:
                y_cause.append(3)
                y_delay.append(congestion * 10)
            elif rain > 2.0:
                y_cause.append(4)
                y_delay.append(congestion * 8)
            elif congestion > 3.0:
                y_cause.append(0)
                y_delay.append(congestion * 12)
            else:
                y_cause.append(1)
                y_delay.append(congestion * 5)
        
        y_cause = np.array(y_cause)
        y_delay = np.array(y_delay)
    
    # Data validation
    if len(X) < 100:
        logger.error(f"Only {len(X)} samples available. Need at least 100 for training.")
        logger.error("Generate more data: python generate_sample_dataset.py 1000")
        raise ValueError("Insufficient training data")
    
    if len(X) < 1000:
        logger.warning(f"Only {len(X)} samples available. Recommended: 1000+ for decent accuracy, 10,000+ for production")
    
    logger.info(f"Prepared {len(X)} samples")
    logger.info(f"Features: latitude, longitude, speed, congestion, rain, accident, event, hour")
    logger.info(f"Cause distribution: {np.bincount(y_cause)}")
    logger.info(f"Delay range: {y_delay.min():.2f} - {y_delay.max():.2f} minutes")
    
    return X, y_cause, y_delay

def train_tabnet_models():
    """Train TabNet cause classifier and delay regressor"""
    
    try:
        from pytorch_tabnet.tab_model import TabNetClassifier, TabNetRegressor
    except ImportError:
        logger.error("pytorch-tabnet not installed. Run: pip install pytorch-tabnet")
        return False
    
    # Prepare data
    X, y_cause, y_delay = prepare_data()
    
    # Adjust split based on dataset size
    if len(X) < 500:
        test_size = 0.15  # Use less for test if small dataset
        val_size = 0.15
    else:
        test_size = 0.2
        val_size = 0.2
    
    # Split data
    logger.info(f"Splitting data ({int((1-test_size)*100)}% train, {int(test_size*100)}% test)...")
    X_train, X_test, y_cause_train, y_cause_test, y_delay_train, y_delay_test = train_test_split(
        X, y_cause, y_delay, test_size=test_size, random_state=42, stratify=y_cause
    )
    
    # Further split training data for validation
    X_train, X_val, y_cause_train, y_cause_val, y_delay_train, y_delay_val = train_test_split(
        X_train, y_cause_train, y_delay_train, test_size=val_size, random_state=42, stratify=y_cause_train
    )
    
    # Adjust batch size based on dataset size
    if len(X_train) < 500:
        batch_size = 32
        virtual_batch_size = 16
        max_epochs = 50
    else:
        batch_size = 256
        virtual_batch_size = 128
        max_epochs = 100
    
    logger.info(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")
    logger.info(f"Batch size: {batch_size}, Max epochs: {max_epochs}")
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Train cause classifier
    logger.info("=" * 50)
    logger.info("Training Cause Classifier...")
    logger.info("=" * 50)
    
    cause_model = TabNetClassifier(
        n_d=8,
        n_a=8,
        n_steps=3,
        gamma=1.3,
        n_independent=2,
        n_shared=2,
        lambda_sparse=1e-3,
        momentum=0.02,
        mask_type='sparsemax',
        verbose=1
    )
    
    cause_model.fit(
        X_train, y_cause_train,
        eval_set=[(X_val, y_cause_val)],
        max_epochs=max_epochs,
        patience=10,
        batch_size=batch_size,
        virtual_batch_size=virtual_batch_size,
        num_workers=0,
        drop_last=False
    )
    
    # Evaluate cause classifier
    cause_pred = cause_model.predict(X_test)
    cause_accuracy = accuracy_score(y_cause_test, cause_pred)
    
    logger.info("=" * 50)
    logger.info(f"Cause Classifier Accuracy: {cause_accuracy:.4f}")
    logger.info("=" * 50)
    logger.info("\nClassification Report:")
    logger.info(classification_report(y_cause_test, cause_pred, 
                                     target_names=['Rush Hour', 'Construction', 'Accident', 
                                                  'Event', 'Weather']))
    
    # Save cause model
    cause_model.save_model('models/tabnet_cause')
    logger.info("✓ Cause model saved to models/tabnet_cause.zip")
    
    # Train delay regressor
    logger.info("=" * 50)
    logger.info("Training Delay Regressor...")
    logger.info("=" * 50)
    
    delay_model = TabNetRegressor(
        n_d=8,
        n_a=8,
        n_steps=3,
        gamma=1.3,
        n_independent=2,
        n_shared=2,
        lambda_sparse=1e-3,
        momentum=0.02,
        mask_type='sparsemax',
        verbose=1
    )
    
    # Reshape delay labels for regression (needs 2D)
    y_delay_train_2d = y_delay_train.reshape(-1, 1)
    y_delay_val_2d = y_delay_val.reshape(-1, 1)
    
    delay_model.fit(
        X_train, y_delay_train_2d,
        eval_set=[(X_val, y_delay_val_2d)],
        max_epochs=max_epochs,
        patience=10,
        batch_size=batch_size,
        virtual_batch_size=virtual_batch_size,
        num_workers=0,
        drop_last=False
    )
    
    # Evaluate delay regressor
    delay_pred = delay_model.predict(X_test).flatten()
    delay_mae = mean_absolute_error(y_delay_test, delay_pred)
    
    logger.info("=" * 50)
    logger.info(f"Delay Regressor MAE: {delay_mae:.4f} minutes")
    logger.info("=" * 50)
    
    # Save delay model
    delay_model.save_model('models/tabnet_delay')
    logger.info("✓ Delay model saved to models/tabnet_delay.zip")
    
    logger.info("=" * 50)
    logger.info("✓ TabNet training complete!")
    logger.info("=" * 50)
    
    return True

if __name__ == "__main__":
    import sys
    success = train_tabnet_models()
    sys.exit(0 if success else 1)
