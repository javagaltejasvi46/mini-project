import React, { useState } from 'react';
import RouteMap from './RouteMap';

const trafficStyle = (level) => {
  if (level < 40) return { text: 'text-secondary-fixed-dim', bg: 'bg-secondary-fixed-dim/10', border: 'border-secondary-fixed-dim/30', bar: '#00dce5', label: 'Light' };
  if (level < 70) return { text: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/30', bar: '#ffb59c', label: 'Moderate' };
  return { text: 'text-error', bg: 'bg-error/10', border: 'border-error/30', bar: '#ffb4ab', label: 'Heavy' };
};

const ROUTE_LABELS = ['A', 'B', 'C'];

const AlternateRoutes = ({ routesData, recommendations }) => {
  const routes = routesData?.routes || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">alt_route</span>
          <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">Alternate Routes</h3>
        </div>
        {routes.length > 0 && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold border border-primary/20">
            {routes.length} route{routes.length > 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col gap-4">
        {routes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <span className="material-symbols-outlined text-4xl text-outline">route</span>
            <p className="text-sm text-on-surface-variant">No routes found. Make sure start and end coordinates are valid.</p>
          </div>
        ) : (
          <>
            {/* Map — shows selected route */}
            <RouteMap
              routes={routes}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              height="300px"
            />

            {/* Route cards */}
            {routes.map((route, i) => {
              const ts = trafficStyle(route.traffic_level);
              const totalTime = route.estimated_time + route.predicted_delay;
              const isSelected = i === selectedIndex;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-secondary-fixed-dim/30 bg-secondary-fixed-dim/5'
                      : 'border-outline-variant/10 bg-surface-container-low hover:bg-surface-bright'
                  }`}
                  onClick={() => setSelectedIndex(i)}
                >
                  {/* Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isSelected
                      ? 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30'
                      : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant'
                  }`}>
                    {ROUTE_LABELS[i] || i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {i === 0 && <span className="text-[10px] font-semibold text-secondary-fixed-dim uppercase tracking-wider">⭐ Best</span>}
                      <span className="text-sm font-medium text-on-surface truncate">
                        {route.route_type === 'shortest' ? 'Shortest Path' : `Alternative Route ${i}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[13px]">straighten</span>
                        {route.distance.toFixed(1)} km
                      </span>
                      <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        {Math.round(totalTime)} min total
                      </span>
                      <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[13px]">warning</span>
                        +{route.predicted_delay.toFixed(1)} min delay
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ts.bg} ${ts.border} ${ts.text}`}>
                        {ts.label} ({route.traffic_level})
                      </span>
                    </div>
                    <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(route.traffic_level, 100)}%`, background: ts.bar }}
                      ></div>
                    </div>
                    {route.recommendation && (
                      <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed italic">{route.recommendation}</p>
                    )}
                  </div>

                  {/* Select button */}
                  <button
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30'
                        : 'bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/30'
                    }`}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                    <span className="material-symbols-outlined text-[13px]">
                      {isSelected ? 'check' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              );
            })}
          </>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-2 p-4 bg-surface-container-low rounded-xl border-l-2 border-tertiary border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-tertiary text-[16px]">lightbulb</span>
              <span className="text-[0.7rem] uppercase tracking-[0.1em] font-semibold text-tertiary">Recommendations</span>
            </div>
            <div className="flex flex-col gap-2">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <span className="w-4 h-4 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">✓</span>
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlternateRoutes;
