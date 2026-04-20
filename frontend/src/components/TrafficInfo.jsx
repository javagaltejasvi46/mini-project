import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const trafficColor = (level) => {
  if (level < 40) return { text: 'text-secondary-fixed-dim', bg: 'bg-secondary-fixed-dim/10', border: 'border-secondary-fixed-dim/30', hex: '#00dce5', label: 'Light' };
  if (level < 70) return { text: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/30', hex: '#ffb59c', label: 'Moderate' };
  return { text: 'text-error', bg: 'bg-error/10', border: 'border-error/30', hex: '#ffb4ab', label: 'Heavy' };
};

const TrafficInfo = ({ data }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  const tc = trafficColor(data.current_traffic_level);
  const confidencePct = Math.round(data.prediction_confidence * 100);

  const handleFeedbackSubmit = (result) => {
    setShowFeedback(false);
    setFeedbackDone(true);
    if (result.model_updated) alert('🎉 Your feedback helped improve the model!');
  };

  return (
    <>
      <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">traffic</span>
            <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">Traffic Analysis</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tc.bg} ${tc.border} ${tc.text}`}>
            {data.location}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Big number */}
          <div className={`flex flex-col items-center justify-center p-6 rounded-xl border ${tc.bg} ${tc.border} gap-3`}>
            <span className="text-[4rem] font-black tracking-[-0.04em] leading-none" style={{ color: tc.hex }}>
              {data.current_traffic_level}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${tc.bg} ${tc.border} ${tc.text}`}>
              {tc.label} Traffic
            </span>
          </div>

          {/* Details */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {[
              { icon: 'warning', label: 'Reason', value: data.traffic_reason },
              { icon: 'timer', label: 'Expected Delay', value: `${data.predicted_delay.toFixed(1)} minutes`, highlight: true },
              { icon: 'category', label: 'Cause', value: data.cause },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 transition-colors">
                <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">{item.icon}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold">{item.label}</span>
                  <span className={`text-sm font-medium ${item.highlight ? 'text-tertiary' : 'text-on-surface'}`}>{item.value}</span>
                </div>
              </div>
            ))}

            {/* Confidence bar */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold">Prediction Confidence</span>
                <span className="text-sm font-semibold text-secondary-fixed-dim">{confidencePct}%</span>
              </div>
              <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary-fixed-dim rounded-full transition-all duration-700"
                  style={{ width: `${confidencePct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="px-6 pb-6">
          {!feedbackDone ? (
            <button
              onClick={() => setShowFeedback(true)}
              className="w-full py-3 rounded-xl bg-surface-container-low border border-outline-variant/15 text-sm font-medium text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">rate_review</span>
              Rate This Prediction
            </button>
          ) : (
            <div className="w-full py-3 rounded-xl bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/30 text-secondary-fixed-dim text-sm font-medium text-center">
              ✓ Thank you for your feedback!
            </div>
          )}
        </div>
      </div>

      {showFeedback && data.prediction_id && (
        <FeedbackModal
          predictionId={data.prediction_id}
          predictedDelay={data.predicted_delay}
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </>
  );
};

export default TrafficInfo;
