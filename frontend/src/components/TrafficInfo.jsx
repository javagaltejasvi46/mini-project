import { useState } from 'react'
import FeedbackModal from './FeedbackModal'
import './TrafficInfo.css'

const TrafficInfo = ({ data }) => {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const getTrafficColor = (level) => {
    if (level < 40) return '#34a853'  // Google Green
    if (level < 70) return '#fbbc04'  // Google Yellow
    return '#ea4335'  // Google Red
  }

  const getTrafficStatus = (level) => {
    if (level < 40) return 'Light'
    if (level < 70) return 'Moderate'
    return 'Heavy'
  }

  const getBadgeClass = (level) => {
    if (level < 40) return 'badge-green'
    if (level < 70) return 'badge-yellow'
    return 'badge-red'
  }

  const handleFeedbackSubmit = (result) => {
    setShowFeedback(false)
    setFeedbackSubmitted(true)
    
    if (result.model_updated) {
      alert('🎉 Thank you! Your feedback helped improve our model!')
    } else {
      alert('✅ Thank you for your feedback!')
    }
  }

  return (
    <div className="traffic-info-container glass-card">
      <div className="section-header">
        <span className="section-icon">🚦</span>
        <h2 className="section-title">Traffic Analysis</h2>
        <span className={`glass-badge ${getBadgeClass(data.current_traffic_level)}`}>
          {data.location}
        </span>
      </div>

      <div className="traffic-status-grid">
        <div className="status-main">
          <div className="status-value" style={{ color: getTrafficColor(data.current_traffic_level) }}>
            {data.current_traffic_level}
          </div>
          <div className={`glass-badge ${getBadgeClass(data.current_traffic_level)}`}>
            {getTrafficStatus(data.current_traffic_level)} Traffic
          </div>
        </div>

        <div className="status-details">
          <div className="status-item">
            <span className="status-icon">⚠️</span>
            <div className="status-content">
              <span className="status-label">Reason</span>
              <span className="status-text">{data.traffic_reason}</span>
            </div>
          </div>

          <div className="status-item">
            <span className="status-icon">⏱️</span>
            <div className="status-content">
              <span className="status-label">Expected Delay</span>
              <span className="status-text delay-highlight">{data.predicted_delay.toFixed(1)} minutes</span>
            </div>
          </div>

          <div className="status-item">
            <span className="status-icon">🎯</span>
            <div className="status-content">
              <span className="status-label">Confidence</span>
              <div className="glass-progress">
                <div 
                  className="glass-progress-fill" 
                  style={{ 
                    width: `${data.prediction_confidence * 100}%`,
                    background: 'linear-gradient(90deg, var(--primary-blue), var(--primary-green))'
                  }}
                ></div>
              </div>
              <span className="status-text">{(data.prediction_confidence * 100).toFixed(0)}% Accurate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="feedback-section">
        {!feedbackSubmitted ? (
          <button 
            className="feedback-btn glass-button"
            onClick={() => setShowFeedback(true)}
          >
            <span>📊</span>
            <span>Rate This Prediction</span>
          </button>
        ) : (
          <div className="feedback-thanks glass-badge badge-green">
            ✅ Thank you for your feedback!
          </div>
        )}
      </div>

      {showFeedback && data.prediction_id && (
        <FeedbackModal
          predictionId={data.prediction_id}
          predictedDelay={data.predicted_delay}
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  )
}

export default TrafficInfo
