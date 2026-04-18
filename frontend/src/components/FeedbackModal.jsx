import { useState } from 'react'
import './FeedbackModal.css'

const FeedbackModal = ({ predictionId, predictedDelay, onClose, onSubmit }) => {
  const [accuracyRating, setAccuracyRating] = useState(0)
  const [usefulnessRating, setUsefulnessRating] = useState(0)
  const [actualDelay, setActualDelay] = useState('')
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (accuracyRating === 0 || usefulnessRating === 0) {
      alert('Please provide both ratings')
      return
    }

    setSubmitting(true)

    const feedbackData = {
      prediction_id: predictionId,
      accuracy_rating: accuracyRating,
      usefulness_rating: usefulnessRating,
      actual_delay: actualDelay ? parseFloat(actualDelay) : null,
      comments: comments || null,
      was_helpful: (accuracyRating + usefulnessRating) / 2 >= 3
    }

    try {
      const response = await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })

      const result = await response.json()
      
      if (response.ok) {
        onSubmit(result)
      } else {
        alert('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({ rating, setRating, label }) => (
    <div className="rating-group">
      <label>{label}</label>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'active' : ''}`}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Help Us Improve</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="feedback-section">
            <StarRating
              rating={accuracyRating}
              setRating={setAccuracyRating}
              label="How accurate was the prediction?"
            />

            <StarRating
              rating={usefulnessRating}
              setRating={setUsefulnessRating}
              label="How useful was this information?"
            />

            <div className="input-group">
              <label>
                Actual delay you experienced (optional)
                <span className="hint">Predicted: {predictedDelay.toFixed(1)} minutes</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter actual delay in minutes"
                value={actualDelay}
                onChange={(e) => setActualDelay(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Additional comments (optional)</label>
              <textarea
                rows="3"
                placeholder="Tell us more about your experience..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal
