import React, { useState } from 'react';
import { api } from '../api';

const StarRating = ({ rating, setRating, label }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[0.65rem] uppercase tracking-[0.1em] text-on-surface-variant font-semibold">{label}</label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`text-2xl transition-colors ${star <= rating ? 'text-tertiary' : 'text-outline/40 hover:text-outline'}`}
        >
          ★
        </button>
      ))}
    </div>
  </div>
);

const FeedbackModal = ({ predictionId, predictedDelay, onClose, onSubmit }) => {
  const [accuracyRating, setAccuracyRating]     = useState(0);
  const [usefulnessRating, setUsefulnessRating] = useState(0);
  const [actualDelay, setActualDelay]           = useState('');
  const [comments, setComments]                 = useState('');
  const [submitting, setSubmitting]             = useState(false);

  const inputCls = "w-full bg-surface-container-low border border-outline-variant/15 rounded-lg px-3 py-2.5 text-sm text-on-surface outline-none placeholder:text-outline/50 focus:border-primary/40 transition-colors";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accuracyRating || !usefulnessRating) { alert('Please provide both ratings'); return; }
    setSubmitting(true);
    try {
      const result = await api.feedback({
        prediction_id: predictionId,
        accuracy_rating: accuracyRating,
        usefulness_rating: usefulnessRating,
        actual_delay: actualDelay ? parseFloat(actualDelay) : null,
        comments: comments || null,
        was_helpful: (accuracyRating + usefulnessRating) / 2 >= 3,
      });
      onSubmit(result);
    } catch {
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm"></div>
      <div
        className="relative w-full max-w-md bg-surface-container-high rounded-2xl border border-outline-variant/15 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-surface-container-highest/60 backdrop-blur-[12px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">rate_review</span>
            <h3 className="text-sm font-semibold text-on-surface">Help Us Improve</h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <StarRating rating={accuracyRating} setRating={setAccuracyRating} label="How accurate was the prediction?" />
          <StarRating rating={usefulnessRating} setRating={setUsefulnessRating} label="How useful was this information?" />

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] uppercase tracking-[0.1em] text-on-surface-variant font-semibold">
              Actual delay experienced
              <span className="ml-2 normal-case text-outline font-normal">(predicted: {predictedDelay.toFixed(1)} min)</span>
            </label>
            <input type="number" step="0.1" min="0" className={inputCls} placeholder="Enter actual delay in minutes" value={actualDelay} onChange={e => setActualDelay(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] uppercase tracking-[0.1em] text-on-surface-variant font-semibold">Additional comments (optional)</label>
            <textarea rows="3" className={inputCls + ' resize-none'} placeholder="Tell us more about your experience..." value={comments} onChange={e => setComments(e.target.value)} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/15 text-sm font-medium text-on-surface-variant hover:bg-surface-bright transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
