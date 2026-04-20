import React, { useState } from 'react';
import PlaceSearchInput from './PlaceSearchInput';

const QUICK_ROUTES = [
  { location_name: 'MG Road → Whitefield',      origin: { name: 'MG Road, Bangalore',      lat: 12.9757, lon: 77.6011 }, dest: { name: 'Whitefield, Bangalore',      lat: 12.9698, lon: 77.7499 } },
  { location_name: 'Airport → Orion Mall',       origin: { name: 'Kempegowda Airport',       lat: 13.1986, lon: 77.7066 }, dest: { name: 'Orion Mall, Bangalore',       lat: 12.9716, lon: 77.5553 } },
  { location_name: 'Koramangala → Indiranagar',  origin: { name: 'Koramangala, Bangalore',   lat: 12.9352, lon: 77.6245 }, dest: { name: 'Indiranagar, Bangalore',      lat: 12.9784, lon: 77.6408 } },
];

const LocationInput = ({ onSubmit, loading }) => {
  const [origin, setOrigin] = useState({ name: '', lat: null, lon: null });
  const [dest,   setDest]   = useState({ name: '', lat: null, lon: null });
  const [error,  setError]  = useState('');

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setOrigin({ name: 'My Location', lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError('Could not get your location.')
    );
  };

  const handleQuick = (r) => {
    setOrigin(r.origin);
    setDest(r.dest);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin.lat || !dest.lat) {
      setError('Please select both origin and destination from the suggestions.');
      return;
    }
    setError('');
    onSubmit({
      location_name: `${origin.name} → ${dest.name}`,
      start_lat: origin.lat,
      start_lon: origin.lon,
      end_lat:   dest.lat,
      end_lon:   dest.lon,
    });
  };

  return (
    <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">travel_explore</span>
          <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">Route Input</h3>
        </div>
        <span className="text-[10px] text-outline">Powered by OpenStreetMap</span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        {/* Origin + Destination side by side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        </div>

        {/* Connector line between the two on desktop */}
        <div className="hidden md:flex items-center gap-3 -mt-2 px-1">
          <div className="flex-1 h-px bg-outline-variant/20"></div>
          <span className="material-symbols-outlined text-outline text-[16px]">swap_vert</span>
          <div className="flex-1 h-px bg-outline-variant/20"></div>
        </div>

        {/* Quick routes */}
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.1em] text-on-surface-variant font-semibold mb-2">Quick Routes</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ROUTES.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuick(r)}
                className="text-[11px] px-3 py-1.5 bg-surface-container-low border border-outline-variant/20 rounded-full text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"
              >
                {r.location_name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-error flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px]">error</span>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">{loading ? 'hourglass_top' : 'radar'}</span>
          {loading ? 'Analyzing...' : 'Predict Traffic'}
        </button>
      </form>
    </div>
  );
};

export default LocationInput;
