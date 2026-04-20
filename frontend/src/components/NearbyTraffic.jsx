import React from 'react';

const congestionStyle = (ratio) => {
  if (ratio < 1.5) return { label: 'Free Flow', text: 'text-secondary-fixed-dim', bg: 'bg-secondary-fixed-dim/10', border: 'border-secondary-fixed-dim/30' };
  if (ratio < 3.0) return { label: 'Moderate',  text: 'text-tertiary',            bg: 'bg-tertiary/10',            border: 'border-tertiary/30' };
  return              { label: 'Congested',  text: 'text-error',               bg: 'bg-error/10',               border: 'border-error/30' };
};

const NearbyTraffic = ({ data }) => (
  <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden">
    {/* Header */}
    <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">sensors</span>
        <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">Nearby Traffic Sensors</h3>
      </div>
      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold border border-primary/20">
        {data.length} sensor{data.length > 1 ? 's' : ''}
      </span>
    </div>

    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map((point, i) => {
        const cs = congestionStyle(point.congestion_ratio);
        return (
          <div key={i} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 transition-colors flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-on-surface-variant">{point.lat.toFixed(4)}, {point.lon.toFixed(4)}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cs.bg} ${cs.border} ${cs.text}`}>{cs.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: 'directions_car', label: 'Speed',      value: `${point.current_speed.toFixed(0)} km/h` },
                { icon: 'compress',       label: 'Congestion', value: `${point.congestion_ratio.toFixed(2)}×` },
                { icon: 'water_drop',     label: 'Rain',       value: point.rain > 0 ? `${point.rain.toFixed(1)} mm/h` : 'None' },
                { icon: 'schedule',       label: 'Updated',    value: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-outline text-[13px]">{m.icon}</span>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-outline">{m.label}</p>
                    <p className="text-xs font-medium text-on-surface">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {(point.accident || point.event) && (
              <div className="flex gap-2 flex-wrap">
                {point.accident && <span className="text-[10px] px-2 py-0.5 rounded-full bg-error/10 border border-error/30 text-error font-semibold">🚨 Accident</span>}
                {point.event    && <span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary font-semibold">🎪 Event</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default NearbyTraffic;
