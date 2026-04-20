import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useEffect } from 'react';

const ROUTE_COLORS = ['#00dce5', '#c8bfff', '#ffb59c'];
const ROUTE_LABELS = ['A', 'B', 'C'];
const ROUTE_NAMES  = ['Best Route', 'Alternative 1', 'Alternative 2'];

const trafficStyle = (level) => {
  if (level < 40) return { text: 'text-secondary-fixed-dim', bg: 'bg-secondary-fixed-dim/10', border: 'border-secondary-fixed-dim/30', bar: '#00dce5', label: 'Light' };
  if (level < 70) return { text: 'text-tertiary',            bg: 'bg-tertiary/10',            border: 'border-tertiary/30',            bar: '#ffb59c', label: 'Moderate' };
  return            { text: 'text-error',               bg: 'bg-error/10',               border: 'border-error/30',               bar: '#ffb4ab', label: 'Heavy' };
};

const BoundsFitter = ({ routes, selectedIndex }) => {
  const map = useMap();
  useEffect(() => {
    const route = routes?.[selectedIndex];
    if (!route?.coordinates?.length) return;
    try { map.fitBounds(route.coordinates, { padding: [48, 48], maxZoom: 15 }); } catch {}
  }, [routes, selectedIndex, map]);
  return null;
};

const AlternateRoutes = ({ routesData, recommendations }) => {
  const routes = routesData?.routes || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = routes[selectedIndex];
  const mapCenter = selected?.coordinates?.length
    ? selected.coordinates[Math.floor(selected.coordinates.length / 2)]
    : [12.97, 77.59];

  return (
    <div
      className="rounded-xl border border-outline-variant/10 overflow-hidden"
      style={{ background: '#1c1b1c', borderTop: '2px solid rgba(200,191,255,0.35)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-outline text-[16px]">alt_route</span>
          <span className="text-[0.7rem] uppercase tracking-[0.1em] font-semibold text-outline">Alternate Routes</span>
        </div>
        {routes.length > 0 && (
          <span className="px-2.5 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-semibold border border-outline-variant/15">
            {routes.length} found
          </span>
        )}
      </div>

      {routes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <span className="material-symbols-outlined text-5xl text-outline/30">route</span>
          <p className="text-sm text-outline/60">Routes will appear here after prediction</p>
        </div>
      ) : (
        /* Two-column split: map (bigger) | routes (smaller) */
        <div className="flex flex-col lg:flex-row">

          {/* ── Left: Map — 60% ── */}
          <div className="lg:w-[60%] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-outline-variant/10">
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: '480px', width: '100%' }}
              zoomControl={true}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={19}
              />
              <BoundsFitter routes={routes} selectedIndex={selectedIndex} />

              {/* All route polylines */}
              {routes.map((route, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <Polyline
                    key={i}
                    positions={route.coordinates}
                    pathOptions={{
                      color: isSelected ? ROUTE_COLORS[i % ROUTE_COLORS.length] : '#474557',
                      weight: isSelected ? 5 : 2,
                      opacity: isSelected ? 0.95 : 0.35,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                    eventHandlers={{ click: () => setSelectedIndex(i) }}
                  >
                    <Tooltip sticky>
                      {ROUTE_NAMES[i] || `Route ${i + 1}`} · {route.distance.toFixed(1)} km · {Math.round(route.estimated_time + route.predicted_delay)} min
                    </Tooltip>
                  </Polyline>
                );
              })}

              {/* Origin */}
              {selected?.coordinates?.length > 0 && (
                <CircleMarker
                  center={selected.coordinates[0]}
                  radius={9}
                  pathOptions={{ color: '#fff', fillColor: '#00dce5', fillOpacity: 1, weight: 2 }}
                >
                  <Tooltip permanent direction="top" offset={[0, -12]}>Origin</Tooltip>
                </CircleMarker>
              )}

              {/* Destination */}
              {selected?.coordinates?.length > 1 && (
                <CircleMarker
                  center={selected.coordinates[selected.coordinates.length - 1]}
                  radius={9}
                  pathOptions={{ color: '#fff', fillColor: '#c8bfff', fillOpacity: 1, weight: 2 }}
                >
                  <Tooltip permanent direction="top" offset={[0, -12]}>Destination</Tooltip>
                </CircleMarker>
              )}
            </MapContainer>
          </div>

          {/* ── Right: Route list — 40% ── */}
          <div className="flex-1 flex flex-col">
            {/* Route rows */}
            <div className="flex flex-col divide-y divide-outline-variant/10 flex-1">
              {routes.map((route, i) => {
                const ts = trafficStyle(route.traffic_level);
                const totalTime = Math.round(route.estimated_time + route.predicted_delay);
                const isSelected = i === selectedIndex;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`shimmer-hover flex items-start gap-4 px-6 py-5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-secondary-fixed-dim/5 border-l-2 border-secondary-fixed-dim'
                        : 'hover:bg-surface-container-low border-l-2 border-transparent'
                    }`}
                  >
                    {/* Label badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-secondary-fixed-dim text-surface'
                        : 'bg-surface-container border border-outline-variant/20 text-outline'
                    }`}>
                      {ROUTE_LABELS[i]}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {i === 0 && <span className="text-[10px] text-secondary-fixed-dim font-bold">★</span>}
                        <span className={`text-sm font-semibold ${isSelected ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {ROUTE_NAMES[i] || `Route ${i + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-outline mb-2.5">
                        <span>{route.distance.toFixed(1)} km</span>
                        <span className="text-outline/30">·</span>
                        <span>{totalTime} min</span>
                        <span className="text-outline/30">·</span>
                        <span className={ts.text}>+{route.predicted_delay.toFixed(1)} delay</span>
                      </div>

                      {/* Traffic progress bar */}
                      <div className="h-1 bg-surface-container rounded-full overflow-hidden mb-2.5">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(route.traffic_level, 100)}%`, background: ts.bar }}
                        />
                      </div>

                      {route.recommendation && (
                        <p className="text-[10px] text-outline leading-relaxed italic line-clamp-2">
                          {route.recommendation}
                        </p>
                      )}
                    </div>

                    {/* Right side: badge + select */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ts.bg} ${ts.border} ${ts.text}`}>
                        {ts.label}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                        className={`text-[10px] font-semibold px-3 py-1 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-secondary-fixed-dim/15 text-secondary-fixed-dim'
                            : 'bg-surface-container text-outline hover:text-primary border border-outline-variant/15'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendation footer */}
            {recommendations && recommendations.length > 0 && (
              <div className="px-6 py-4 border-t border-outline-variant/10 mt-auto">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline/60 text-[13px] mt-0.5 flex-shrink-0">info</span>
                  <p className="text-[11px] text-outline leading-relaxed">{recommendations[0]}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternateRoutes;
