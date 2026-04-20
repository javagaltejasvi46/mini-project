import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import { useReveal, useCountUp } from '../hooks/useReveal';

const trafficColor = (level) => {
  if (level < 40) return { text: 'text-secondary-fixed-dim', hex: '#00dce5', glow: 'rgba(0,220,229,0.08)',    label: 'Light',    border: 'border-secondary-fixed-dim/30' };
  if (level < 70) return { text: 'text-tertiary',            hex: '#ffb59c', glow: 'rgba(255,181,156,0.08)', label: 'Moderate', border: 'border-tertiary/30' };
  return            { text: 'text-error',               hex: '#ffb4ab', glow: 'rgba(255,180,171,0.08)', label: 'Heavy',    border: 'border-error/30' };
};

const causeStyle = (cause = '') => {
  const c = cause.toLowerCase();
  if (c.includes('accident'))              return { icon: 'emergency',     color: '#ffb4ab', bg: 'rgba(255,180,171,0.08)', border: 'rgba(255,180,171,0.2)' };
  if (c.includes('construction'))          return { icon: 'construction',  color: '#ffb59c', bg: 'rgba(255,181,156,0.08)', border: 'rgba(255,181,156,0.2)' };
  if (c.includes('weather')||c.includes('rain')) return { icon: 'water_drop', color: '#c8bfff', bg: 'rgba(200,191,255,0.08)', border: 'rgba(200,191,255,0.2)' };
  if (c.includes('event'))                 return { icon: 'festival',      color: '#00dce5', bg: 'rgba(0,220,229,0.08)',   border: 'rgba(0,220,229,0.2)' };
  if (c.includes('rush'))                  return { icon: 'directions_car',color: '#ffb59c', bg: 'rgba(255,181,156,0.08)', border: 'rgba(255,181,156,0.2)' };
  return                                          { icon: 'traffic',       color: '#928ea3', bg: 'rgba(146,142,163,0.06)', border: 'rgba(146,142,163,0.15)' };
};

const TrafficInfo = ({ data }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [cardRef, cardVisible] = useReveal();
  const animatedLevel = useCountUp(data.current_traffic_level, cardVisible, 900);
  const animatedDelay = useCountUp(Math.round(data.predicted_delay * 10), cardVisible, 800);

  const tc  = trafficColor(data.current_traffic_level);
  const cs  = causeStyle(data.traffic_reason);
  const confidencePct = Math.round(data.prediction_confidence * 100);

  const handleFeedbackSubmit = (result) => {
    setShowFeedback(false);
    setFeedbackDone(true);
    if (result.model_updated) alert('🎉 Your feedback helped improve the model!');
  };

  return (
    <>
      {/* Card with a coloured top accent line matching traffic severity */}
      <div
        ref={cardRef}
        className="rounded-xl border border-outline-variant/10 overflow-hidden card-hover"
        style={{
          background: '#1c1b1c',
          borderTop: `2px solid ${tc.hex}`,
          boxShadow: `0 0 24px ${tc.glow}, 0 1px 0 rgba(255,255,255,0.04) inset`,
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]" style={{ color: tc.hex }}>traffic</span>
            <span className="text-[0.7rem] uppercase tracking-[0.1em] font-semibold text-outline">Traffic Analysis</span>
          </div>
          <span
            className="px-3 py-1 rounded-full text-[11px] font-semibold border"
            style={{ color: tc.hex, borderColor: `${tc.hex}40`, background: `${tc.hex}10` }}
          >
            {data.location}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Big traffic level — no inner card, just the number floating */}
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <span
              className="text-[5.5rem] font-black tracking-[-0.05em] leading-none tabular-nums"
              style={{ color: tc.hex, textShadow: `0 0 40px ${tc.hex}60` }}
            >
              {animatedLevel}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border"
              style={{ color: tc.hex, borderColor: `${tc.hex}40`, background: `${tc.hex}10` }}
            >
              {tc.label} Traffic
            </span>
          </div>

          {/* Detail rows */}
          <div className="md:col-span-2 flex flex-col gap-3">

            {/* Cause */}
            <div
              className="flex items-center gap-4 p-4 rounded-xl border"
              style={{ background: cs.bg, borderColor: cs.border }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${cs.color}15`, border: `1px solid ${cs.color}30` }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: cs.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {cs.icon}
                </span>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-outline font-semibold mb-0.5">Traffic Cause</p>
                <p className="text-sm font-semibold" style={{ color: cs.color }}>{data.traffic_reason}</p>
              </div>
            </div>

            {/* Delay + Confidence side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Delay */}
              <div className="p-4 rounded-xl border border-outline-variant/10 bg-surface-container-lowest/60">
                <p className="text-[9px] uppercase tracking-[0.12em] text-outline font-semibold mb-1.5">Expected Delay</p>
                <p className="text-2xl font-black tracking-tight text-tertiary tabular-nums">
                  {(animatedDelay / 10).toFixed(1)}
                  <span className="text-sm font-medium text-outline ml-1">min</span>
                </p>
              </div>

              {/* Confidence */}
              <div className="p-4 rounded-xl border border-outline-variant/10 bg-surface-container-lowest/60">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-outline font-semibold">Confidence</p>
                  <p className="text-sm font-black text-secondary-fixed-dim tabular-nums">{confidencePct}%</p>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${confidencePct}%`,
                      background: 'linear-gradient(90deg, #582cff, #00dce5)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="px-6 pb-5">
          {!feedbackDone ? (
            <button
              onClick={() => setShowFeedback(true)}
              className="w-full py-2.5 rounded-xl border border-outline-variant/15 text-xs font-medium text-outline hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="material-symbols-outlined text-[14px]">rate_review</span>
              Rate This Prediction
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-xl text-secondary-fixed-dim text-xs font-medium text-center border border-secondary-fixed-dim/25"
              style={{ background: 'rgba(0,220,229,0.06)' }}>
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
