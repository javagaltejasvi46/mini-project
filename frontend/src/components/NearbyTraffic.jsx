import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const congestionStyle = (ratio) => {
  if (ratio < 1.5) return { label: 'Free Flow', text: 'text-secondary-fixed-dim', bg: 'bg-secondary-fixed-dim/10', border: 'border-secondary-fixed-dim/25' };
  if (ratio < 3.0) return { label: 'Moderate',  text: 'text-tertiary',            bg: 'bg-tertiary/10',            border: 'border-tertiary/25' };
  return              { label: 'Congested',  text: 'text-error',               bg: 'bg-error/10',               border: 'border-error/25' };
};

const INITIAL_VISIBLE = 3;

const NearbyTraffic = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [gridRef, gridVisible] = useReveal();

  const visible = expanded ? data : data.slice(0, INITIAL_VISIBLE);
  const hiddenCount = data.length - INITIAL_VISIBLE;

  return (
    <div
      className="rounded-xl border border-outline-variant/10 overflow-hidden"
      style={{ background: '#1c1b1c', borderTop: '2px solid rgba(146,142,163,0.4)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-outline text-[16px]">sensors</span>
          <span className="text-[0.7rem] uppercase tracking-[0.1em] font-semibold text-outline">Nearby Traffic Sensors</span>
        </div>
        <span className="px-2.5 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-semibold border border-outline-variant/15">
          {data.length} sensor{data.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Sensor grid */}
      <div className="p-5">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {visible.map((point, i) => {
            const cs = congestionStyle(point.congestion_ratio);
            return (
              <div
                key={i}
                className={`sensor-card p-4 rounded-xl border border-outline-variant/25 hover:border-outline-variant/40 transition-colors ${gridVisible ? 'is-visible' : ''}`}
                style={{ background: '#161516', transitionDelay: `${i * 55}ms` }}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-on-surface-variant tracking-tight">
                    {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
                  </span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${cs.bg} ${cs.border} ${cs.text}`}>
                    {cs.label}
                  </span>
                </div>

                {/* Metrics — 2×2 grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  {[
                    { icon: 'speed',          label: 'Speed',      value: `${point.current_speed.toFixed(0)} km/h` },
                    { icon: 'compress',       label: 'Congestion', value: `${point.congestion_ratio.toFixed(2)}×` },
                    { icon: 'water_drop',     label: 'Rain',       value: point.rain > 0 ? `${point.rain.toFixed(1)} mm/h` : 'None' },
                    { icon: 'schedule',       label: 'Updated',    value: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                  ].map(m => (
                    <div key={m.label} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-outline/60 text-[12px]">{m.icon}</span>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-outline/60 leading-none mb-0.5">{m.label}</p>
                        <p className="text-[11px] font-medium text-on-surface leading-none">{m.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alert badges */}
                {(point.accident || point.event) && (
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {point.accident && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-error/10 border border-error/25 text-error font-semibold">
                        🚨 Accident
                      </span>
                    )}
                    {point.event && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/25 text-tertiary font-semibold">
                        🎪 Event
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expand / collapse toggle */}
        {hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-outline-variant/15 text-xs font-medium text-on-surface-variant hover:text-primary hover:border-primary/25 transition-all group"
          >
            <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
            {expanded
              ? 'Show less'
              : `Show ${hiddenCount} more sensor${hiddenCount > 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default NearbyTraffic;
