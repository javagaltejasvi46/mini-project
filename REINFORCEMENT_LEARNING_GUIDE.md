# SmartRoute AI - Reinforcement Learning Implementation Guide

## 🎯 Overview

This system implements reinforcement learning to continuously improve traffic predictions based on user feedback. The model learns from real-world user experiences and adapts over time.

## 🧠 How It Works

### 1. User Provides Feedback
After receiving a traffic prediction, users can rate:
- **Accuracy** (1-5 stars): How accurate was the prediction?
- **Usefulness** (1-5 stars): How useful was the information?
- **Actual Delay** (optional): What delay did you actually experience?
- **Comments** (optional): Additional feedback

### 2. Reward Calculation
The system calculates a reward signal (-1 to +1) based on:
- User ratings (70% weight)
- Prediction accuracy vs actual delay (30% weight)

```python
# Example rewards:
# 5-star ratings + accurate delay = +0.8 reward
# 3-star ratings = 0.0 reward (neutral)
# 1-star ratings + inaccurate delay = -0.8 reward
```

### 3. Learning Buffer
Feedback is stored in a buffer until 100 samples are collected, then:
- Model analyzes which predictions were poor
- Identifies focus areas (high congestion, rain, accidents, etc.)
- Triggers model retraining with weighted samples

### 4. Model Update
- Good predictions (positive reward) get higher weight in training
- Poor predictions (negative reward) get lower weight
- Model learns to avoid mistakes and reinforce good predictions

## 📊 System Architecture

```
User Feedback → Reward Calculation → Learning Buffer → Model Retraining
     ↓                                                         ↓
Database Storage                                    Improved Predictions
```

### Components

1. **Frontend**: `FeedbackModal.jsx` - User feedback interface
2. **Backend API**: `api/feedback.py` - Feedback collection endpoint
3. **RL Engine**: `ml/reinforcement_learning.py` - Learning logic
4. **Database**: `UserFeedback` & `ModelPerformance` tables

## 🔧 API Endpoints

### Submit Feedback
```bash
POST /feedback
{
  "prediction_id": 123,
  "accuracy_rating": 4,
  "usefulness_rating": 5,
  "actual_delay": 35.5,
  "comments": "Very accurate!"
}
```

Response:
```json
{
  "feedback_id": 456,
  "message": "Thank you for your feedback!",
  "reward_applied": true,
  "model_updated": false
}
```

### Get Feedback Statistics
```bash
GET /feedback/stats
```

Response:
```json
{
  "status": "success",
  "metrics": {
    "total_feedback": 45,
    "avg_accuracy_rating": 4.2,
    "avg_usefulness_rating": 4.5,
    "positive_feedback_rate": 0.85,
    "avg_delay_error": 6.3
  },
  "buffer_size": 45,
  "buffer_capacity": 100
}
```

### Get Model Performance
```bash
GET /model/performance
```

Response:
```json
[
  {
    "model_type": "tabnet_cause",
    "accuracy": 0.75,
    "mae": null,
    "avg_user_rating": 4.2,
    "total_feedback_count": 45,
    "last_updated": "2026-04-19T00:00:00"
  }
]
```

## 💻 Frontend Integration

### Using the Feedback Modal

```jsx
import FeedbackModal from './components/FeedbackModal'

const [showFeedback, setShowFeedback] = useState(false)

// Show feedback modal
<button onClick={() => setShowFeedback(true)}>
  Rate Prediction
</button>

// Render modal
{showFeedback && (
  <FeedbackModal
    predictionId={data.prediction_id}
    predictedDelay={data.predicted_delay}
    onClose={() => setShowFeedback(false)}
    onSubmit={(result) => {
      if (result.model_updated) {
        alert('Model improved!')
      }
    }}
  />
)}
```

## 📈 Performance Tracking

### Metrics Monitored

1. **User Satisfaction**
   - Average accuracy rating
   - Average usefulness rating
   - Positive feedback rate

2. **Prediction Accuracy**
   - Mean Absolute Error (MAE) for delays
   - Cause classification accuracy
   - Delay error distribution

3. **Learning Progress**
   - Feedback buffer size
   - Retraining frequency
   - Model version history

### Database Schema

```sql
-- User Feedback Table
CREATE TABLE user_feedback (
    id SERIAL PRIMARY KEY,
    prediction_id INTEGER REFERENCES predictions(id),
    timestamp TIMESTAMP DEFAULT NOW(),
    accuracy_rating INTEGER CHECK (accuracy_rating BETWEEN 1 AND 5),
    usefulness_rating INTEGER CHECK (usefulness_rating BETWEEN 1 AND 5),
    actual_delay FLOAT,
    actual_cause VARCHAR,
    comments TEXT,
    was_helpful BOOLEAN DEFAULT TRUE,
    user_location GEOGRAPHY(POINT, 4326)
);

-- Model Performance Table
CREATE TABLE model_performance (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    model_type VARCHAR NOT NULL,
    accuracy FLOAT,
    mae FLOAT,
    avg_user_rating FLOAT,
    total_feedback_count INTEGER DEFAULT 0,
    positive_feedback_count INTEGER DEFAULT 0,
    training_samples INTEGER,
    model_version VARCHAR,
    notes TEXT
);
```

## 🎓 Learning Algorithm

### Reward Function

```python
def calculate_reward(accuracy_rating, usefulness_rating, actual_delay, predicted_delay):
    # Base reward from ratings (normalized to -1 to 1)
    rating_reward = ((accuracy_rating + usefulness_rating) / 10 - 0.5) * 2
    
    # Delay accuracy reward
    if actual_delay is not None:
        delay_error = abs(actual_delay - predicted_delay)
        
        if delay_error < 5:
            delay_reward = 0.2  # Good
        elif delay_error < 10:
            delay_reward = 0.0  # Acceptable
        elif delay_error < 20:
            delay_reward = -0.2  # Poor
        else:
            delay_reward = -0.5  # Very poor
        
        # Combine: 70% rating, 30% delay accuracy
        total_reward = 0.7 * rating_reward + 0.3 * delay_reward
    else:
        total_reward = rating_reward
    
    return clip(total_reward, -1.0, 1.0)
```

### Sample Weighting

```python
# Positive feedback gets higher weight
weight = 1.0 + reward  # Range: 0 to 2
weight = max(0.1, weight)  # Minimum 0.1

# During retraining:
# - Good predictions (reward > 0) → weight > 1.0
# - Neutral predictions (reward = 0) → weight = 1.0
# - Poor predictions (reward < 0) → weight < 1.0
```

## 🔄 Retraining Process

### Trigger Conditions
- Buffer reaches 100 feedback samples
- Manual trigger via admin API
- Scheduled weekly retraining

### Retraining Steps
1. Analyze feedback buffer
2. Identify focus areas (scenarios with poor predictions)
3. Prepare weighted training data
4. Fine-tune model with new samples
5. Evaluate on validation set
6. Deploy if performance improves
7. Clear feedback buffer

### Focus Area Analysis

```python
focus_areas = {
    'high_congestion': 15,  # 15 poor predictions in high congestion
    'with_rain': 8,         # 8 poor predictions with rain
    'with_accidents': 5,    # 5 poor predictions with accidents
    'with_events': 12,      # 12 poor predictions with events
    'low_congestion': 3     # 3 poor predictions in low congestion
}

# Model will focus more on high_congestion and with_events scenarios
```

## 📱 User Experience Flow

1. **User requests prediction**
   ```
   Location: MG Road, Bangalore
   → Prediction: 35 min delay, Rush hour traffic
   ```

2. **User experiences actual traffic**
   ```
   Actual delay: 38 minutes
   ```

3. **User provides feedback**
   ```
   Accuracy: ⭐⭐⭐⭐ (4 stars)
   Usefulness: ⭐⭐⭐⭐⭐ (5 stars)
   Actual delay: 38 minutes
   Comments: "Very close! Helped me plan better."
   ```

4. **System calculates reward**
   ```
   Rating reward: 0.8 (high ratings)
   Delay reward: 0.2 (error = 3 min, very good)
   Total reward: 0.72 (positive)
   ```

5. **Feedback stored and model learns**
   ```
   Buffer: 46/100 samples
   Status: Collecting more feedback
   ```

6. **After 100 samples**
   ```
   Trigger retraining
   → Model improves
   → Better predictions for all users
   ```

## 🎯 Expected Improvements

### Short Term (100-500 feedback samples)
- 5-10% improvement in accuracy
- Better predictions for common scenarios
- Reduced delay error by 2-3 minutes

### Medium Term (500-2000 feedback samples)
- 10-15% improvement in accuracy
- Handles edge cases better
- Reduced delay error by 5-7 minutes

### Long Term (2000+ feedback samples)
- 15-20% improvement in accuracy
- Robust to all scenarios
- Reduced delay error by 8-10 minutes

## 🔒 Privacy & Security

- User location is optional and anonymized
- Comments are stored securely
- No personal information collected
- Feedback is aggregated for analysis
- GDPR compliant

## 🚀 Getting Started

### 1. Update Database
```bash
python backend/init_db.py
```

### 2. Start Backend
```bash
cd backend
python main.py
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Test Feedback Flow
1. Get a prediction
2. Click "Rate This Prediction"
3. Provide ratings and actual delay
4. Submit feedback
5. Check `/feedback/stats` endpoint

## 📊 Monitoring Dashboard

### Key Metrics to Track

1. **Feedback Volume**
   - Daily feedback count
   - Feedback completion rate
   - Average time to feedback

2. **Model Performance**
   - Accuracy trend over time
   - MAE trend over time
   - User satisfaction trend

3. **Learning Progress**
   - Retraining frequency
   - Performance improvement per retrain
   - Focus area distribution

## 💡 Best Practices

1. **Encourage Feedback**
   - Make feedback UI prominent
   - Offer incentives (gamification)
   - Show impact of feedback

2. **Quality Control**
   - Validate feedback data
   - Filter spam/outliers
   - Weight trusted users higher

3. **Continuous Monitoring**
   - Track performance metrics
   - Alert on degradation
   - Regular model evaluation

4. **Transparent Communication**
   - Show users how feedback helps
   - Display model improvements
   - Thank users for contributions

## 🎉 Summary

The reinforcement learning system enables SmartRoute AI to:
- ✅ Learn from real user experiences
- ✅ Continuously improve predictions
- ✅ Adapt to changing traffic patterns
- ✅ Provide personalized accuracy
- ✅ Build user trust through transparency

**Result**: A self-improving traffic prediction system that gets better with every user interaction!

---

**Current Status**: ✅ Implemented and ready to use!

**Next Steps**: Collect user feedback and watch the model improve!
