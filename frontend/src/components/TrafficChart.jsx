import React from 'react';
import { useReveal } from '../hooks/useReveal';

const TrafficChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const [chartRef, chartVisible] = useReveal();

  const maxTraffic  = Math.max(...data.map(d => d.traffic_level), 1);
  const maxSpeed    = Math.max(...data.map(d => d.speed), 1);
  const peakTraffic = Math.max(...data.map(d => d.traffic_level));
  const peakSpeed   = Math.max(...data.map(d => d.speed));

  return (
    <div ref={chartRef} className="flex flex-col gap-0 h-full">
      {/* Header with inline stats */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-outline text-[16px]">stacked_bar_chart</span>
          <span className="text-[0.7rem] uppercase tracking-[0.1em] font-semibold text-outline">Traffic Trends</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#c8bfff' }}></span>
            Traffic <span className="font-semibold ml-0.5" style={{ color: '#c8bfff' }}>{peakTraffic}</span> peak
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#00dce5' }}></span>
            Speed <span className="font-semibold ml-0.5" style={{ color: '#00dce5' }}>{peakSpeed.toFixed(0)} km/h</span>
          </span>
          <span className="flex items-center gap-1 text-outline">
            <span className="material-symbols-outlined text-[12px]">schedule</span>
            2h window
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-end gap-[3px] px-1 pb-5 relative min-h-[180px]">
        {/* Subtle horizontal grid lines */}
        {[25, 50, 75, 100].map(pct => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-outline-variant/10 pointer-events-none"
            style={{ bottom: `${pct}%` }}
          />
        ))}

        {data.map((point, i) => {
          const tH = Math.max((point.traffic_level / maxTraffic) * 100, 2);
          const sH = Math.max((point.speed / maxSpeed) * 100, 2);
          return (
            <div key={i} className="flex flex-col items-center gap-0 flex-1 min-w-0 group relative">
              {/* Hover tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                <p className="text-[10px] font-semibold" style={{ color: '#c8bfff' }}>{point.traffic_level} traffic</p>
                <p className="text-[10px]" style={{ color: '#00dce5' }}>{point.speed.toFixed(0)} km/h</p>
                <p className="text-[9px] text-outline">{point.time}</p>
              </div>

              <div className="flex items-end gap-[2px] w-full justify-center" style={{ height: '160px' }}>
                {/* Traffic bar — use opacity animation instead of scaleY to avoid height conflict */}
                <div
                  className="flex-1 rounded-t-[3px] group-hover:opacity-100 opacity-75"
                  style={{
                    height: `${tH}%`,
                    background: 'linear-gradient(to top, #582cff, #c8bfff)',
                    minWidth: '4px',
                    transition: `opacity 0.3s ease, height 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 18}ms`,
                  }}
                />
                {/* Speed bar */}
                <div
                  className="flex-1 rounded-t-[3px] group-hover:opacity-100 opacity-75"
                  style={{
                    height: `${sH}%`,
                    background: 'linear-gradient(to top, #004f53, #00dce5)',
                    minWidth: '4px',
                    transition: `opacity 0.3s ease, height 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 18 + 9}ms`,
                  }}
                />
              </div>

              {i % 4 === 0 && (
                <span className="text-[8px] text-outline/60 mt-1.5 whitespace-nowrap">{point.time}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrafficChart;
