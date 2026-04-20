import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import PlaceSearchInput from './PlaceSearchInput';
import RouteMap from './RouteMap';

const QUICK_ROUTES = [
  { label: 'MG Road → Whitefield',     origin: { name: 'MG Road, Bangalore',    lat: 12.9757, lon: 77.6011 }, dest: { name: 'Whitefield, Bangalore',    lat: 12.9698, lon: 77.7499 } },
  { label: 'Indiranagar → Whitefield', origin: { name: 'Indiranagar, Bangalore', lat: 12.9784, lon: 77.6408 }, dest: { name: 'Whitefield, Bangalore',    lat: 12.9698, lon: 77.7499 } },
  { label: 'Koramangala → Airport',    origin: { name: 'Koramangala, Bangalore', lat: 12.9352, lon: 77.6245 }, dest: { name: 'Kempegowda Airport',        lat: 13.1986, lon: 77.7066 } },
];

const trafficColor = (level) => {
  if (level < 40) return '#00dce5';
  if (level < 70) return '#ffb59c';
  return '#ffb4ab';
};

const NeuralFlowOptimizer = () => {
  const location = useLocation();
  const [origin, setOrigin] = useState({ name: '', lat: null, lon: null });
  const [dest,   setDest]   = useState({ name: '', lat: null, lon: null });

  // Pre-fill origin if navigated here from the top nav search
  useEffect(() => {
    if (location.state?.origin) {
      setOrigin(location.state.origin);
    }
  }, [location.state]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(0);

  const handleQuick = (r) => { setOrigin(r.origin); setDest(r.dest); setError(null); };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) =>
      setOrigin({ name: 'My Location', lat: pos.coords.latitude, lon: pos.coords.longitude })
    );
  };

  const handleEngage = async () => {
    if (!origin.lat || !dest.lat) { setError('Select both origin and destination from suggestions.'); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await api.findRoutes({ start_lat: origin.lat, start_lon: origin.lon, end_lat: dest.lat, end_lon: dest.lon });
      setResult(data);
      setSelectedRoute(0);
    } catch {
      setError('Failed to find routes. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const best = result?.routes?.[selectedRoute];

  return (
    <div className="flex-1 relative h-full w-full flex overflow-hidden bg-surface-container-lowest">
      {/* Map area */}
      <div className="flex-grow relative h-full">
        {result?.routes?.length > 0 ? (
          <RouteMap
            routes={result.routes}
            selectedIndex={selectedRoute}
            onSelect={setSelectedRoute}
            height="100%"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop')" }}
          >
            <div className="absolute inset-0 bg-[#131314]/75 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">map</span>
                <p className="text-on-surface-variant text-sm">Enter a route and engage to see the map</p>
              </div>
            </div>
          </div>
        )}

        {/* Floating input panel */}
        <div className="absolute top-8 left-8 bg-[#353436]/70 backdrop-blur-[24px] rounded-xl p-6 flex flex-col gap-5 border border-[#474557]/20 max-w-sm w-full shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
          <div>
            <h2 className="text-[1.5rem] font-semibold text-on-surface tracking-[-0.02em]">Neural Flow</h2>
            <p className="text-primary text-[0.7rem] uppercase tracking-[0.1em] font-medium mt-1">Route Optimization</p>
          </div>

          <PlaceSearchInput
            label="Origin"
            dotColor="bg-secondary-fixed-dim"
            dotGlow="0 0 6px rgba(0,220,229,0.6)"
            icon="trip_origin"
            iconColor="text-secondary-fixed-dim"
            placeholder="e.g. MG Road, Bangalore"
            value={origin}
            onChange={setOrigin}
            onGeolocate={handleGeolocate}
          />

          <div className="w-px h-3 bg-outline-variant/30 ml-5"></div>

          <PlaceSearchInput
            label="Destination"
            dotColor="bg-primary"
            dotGlow="0 0 6px rgba(200,191,255,0.6)"
            icon="location_on"
            iconColor="text-primary"
            placeholder="e.g. Whitefield, Bangalore"
            value={dest}
            onChange={setDest}
          />

          {/* Quick routes */}
          <div className="flex flex-col gap-2">
            <label className="text-[0.65rem] uppercase tracking-[0.1em] text-on-surface-variant font-semibold">Quick Routes</label>
            <div className="flex flex-wrap gap-2">
              {QUICK_ROUTES.map((r, i) => (
                <button key={i} onClick={() => handleQuick(r)} className="text-[11px] px-3 py-1.5 bg-surface-container-low border border-outline-variant/20 rounded-full text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors">
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[11px] text-error flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">error</span>{error}</p>}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-[420px] h-full bg-surface-container-high border-l border-outline-variant/15 flex flex-col z-10 shrink-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#353436]/60 backdrop-blur-[24px] border-b border-outline-variant/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-on-surface">Optimization Matrix</h3>
            {best && (
              <span className="px-3 py-1 bg-secondary-fixed-dim/20 text-secondary-fixed-dim rounded-full text-xs font-semibold uppercase tracking-wider">
                {result.total_routes} route{result.total_routes > 1 ? 's' : ''} found
              </span>
            )}
          </div>
          {best ? (
            <>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-[3rem] font-bold text-on-surface tracking-[-0.02em] leading-none">
                  {Math.round(best.estimated_time + best.predicted_delay)}
                </span>
                <span className="text-base text-on-surface-variant font-medium">min</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                {best.distance.toFixed(1)} km · +{best.predicted_delay.toFixed(1)} min delay
              </p>
            </>
          ) : (
            <p className="text-sm text-on-surface-variant mt-3">Enter a route and engage to see predictions.</p>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
          {/* Route selector */}
          {result?.routes?.length > 0 && (
            <section className="flex flex-col gap-3">
              <h4 className="text-[0.7rem] text-on-surface-variant uppercase tracking-[0.1em] font-semibold">Available Routes</h4>
              {result.routes.map((route, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedRoute(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${i === selectedRoute ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/15 hover:bg-surface-bright'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-on-surface">
                      {i === 0 ? '⭐ Best Route' : `Alternative ${i}`}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: trafficColor(route.traffic_level), background: `${trafficColor(route.traffic_level)}20` }}>
                      Traffic {route.traffic_level}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-on-surface-variant">
                    <span>{route.distance.toFixed(1)} km</span>
                    <span>{route.estimated_time.toFixed(0)} min base</span>
                    <span>+{route.predicted_delay.toFixed(1)} min delay</span>
                  </div>
                  {route.recommendation && (
                    <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">{route.recommendation}</p>
                  )}
                </button>
              ))}
            </section>
          )}

          {/* Traffic cause analysis */}
          {best && (
            <section className="flex flex-col gap-3">
              <h4 className="text-[0.7rem] text-on-surface-variant uppercase tracking-[0.1em] font-semibold">AI Congestion Analysis</h4>
              <div className="bg-surface-container-low p-4 rounded-xl flex gap-3 items-start border border-[#474557]/15">
                <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-on-surface mb-1">Route Analysis</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{best.traffic_cause}</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex gap-3 items-start border border-[#474557]/15">
                <div className="p-2 bg-secondary-container/10 rounded-lg text-secondary-container mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">route</span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-on-surface mb-1">Waypoints</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {best.coordinates.length} road nodes · {best.route_type} algorithm
                  </p>
                </div>
              </div>
            </section>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs text-on-surface-variant">Computing optimal routes...</p>
            </div>
          )}
        </div>

        {/* Engage button */}
        <div className="p-5 bg-surface-container-high border-t border-outline-variant/10">
          <button
            onClick={handleEngage}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            {loading ? 'Computing...' : 'Engage Neural Route'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeuralFlowOptimizer;
