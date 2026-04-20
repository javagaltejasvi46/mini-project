import React from 'react';

const TrafficChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxTraffic = Math.max(...data.map(d => d.traffic_level), 1);
  const maxSpeed   = Math.max(...data.map(d => d.speed), 1);
  const peakTraffic = Math.max(...data.map(d => d.traffic_level));
  const peakSpeed   = Math.max(...data.map(d => d.speed));

  return (
    <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">waves</span>
          <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">Traffic Trends</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block"></span>Traffic
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-sm bg-secondary-fixed-dim inline-block"></span>Speed
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Chart */}
        <div className="flex items-end gap-1 h-48 bg-surface-container-lowest rounded-xl px-4 py-4 mb-4 overflow-x-auto">
          {data.map((point, i) => {
            const tH = Math.max((point.traffic_level / maxTraffic) * 100, 2);
            const sH = Math.max((point.speed / maxSpeed) * 100, 2);
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[28px] group">
                <div className="flex items-end gap-0.5 h-36 w-full justify-center">
                  <div
                    className="w-2.5 rounded-t-sm bg-primary/70 group-hover:bg-primary transition-colors relative"
                    style={{ height: `${tH}%` }}
                    title={`Traffic: ${point.traffic_level}`}
                  ></div>
                  <div
                    className="w-2.5 rounded-t-sm bg-secondary-fixed-dim/70 group-hover:bg-secondary-fixed-dim transition-colors"
                    style={{ height: `${sH}%` }}
                    title={`Speed: ${point.speed.toFixed(1)} km/h`}
                  ></div>
                </div>
                {i % 4 === 0 && (
                  <span className="text-[9px] text-outline whitespace-nowrap">{point.time}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'trending_up', label: 'Peak Traffic', value: peakTraffic, color: 'text-primary' },
            { icon: 'speed',       label: 'Max Speed',    value: `${peakSpeed.toFixed(0)} km/h`, color: 'text-secondary-fixed-dim' },
            { icon: 'schedule',    label: 'Time Range',   value: '2 Hours', color: 'text-tertiary' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 transition-colors">
              <span className={`material-symbols-outlined text-[20px] ${s.color}`}>{s.icon}</span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold">{s.label}</p>
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficChart;
