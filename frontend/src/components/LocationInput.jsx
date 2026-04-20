import React, { useState } from 'react';
import PlaceSearchInput from './PlaceSearchInput';

const QUICK_ROUTES = [
  { location_name: 'MG Road → Whitefield',     origin: { name: 'MG Road, Bangalore',    lat: 12.9757, lon: 77.6011 }, dest: { name: 'Whitefield, Bangalore',    lat: 12.9698, lon: 77.7499 } },
  { location_name: 'Airport → Orion Mall',      origin: { name: 'Kempegowda Airport',    lat: 13.1986, lon: 77.7066 }, dest: { name: 'Orion Mall, Bangalore',    lat: 12.9716, lon: 77.5553 } },
  { location_name: 'Koramangala → Indiranagar', origin: { name: 'Koramangala, Bangalore', lat: 12.9352, lon: 77.6245 }, dest: { name: 'Indiranagar, Bangalore',   lat: 12.9784, lon: 77.6408 } },
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

  const handleQuick = (r) => { setOrigin(r.origin); setDest(r.dest); setError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin.lat || !dest.lat) {
      setError('Please select both origin and destination from the suggestions.');
      return;
    }
    setError('');
    onSubmit({
      location_name: `${origin.name} → ${dest.name}`,
      start_lat: origin.lat, start_lon: origin.lon,
      end_lat:   dest.lat,   end_lon:   dest.lon,
    });
  };

  return (
    <div
      className="rounded-xl border border-outline-variant/10 overflow-hidden bg-surface-container-high"
      style={{ borderTop: '2px solid rgba(200,191,255,0.25)' }}
    >
      <form onSubmit={handleSubmit}>
        {/* Main input area — more spacious */}
        <div className="p-8 flex flex-col gap-6">
          {/* Origin + Destination in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlaceSearchInput
              label="Origin"
              dotColor="bg-secondary-fixed-dim"
              dotGlow="0 0 6px rgba(0,220,229,0.6)"
              icon="trip_origin"
              iconColor="text-primary"
              placeholder="From — e.g. MG Road, Bangalore"
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
              placeholder="To — e.g. Whitefield, Bangalore"
              value={dest}
              onChange={setDest}
            />
          </div>

          {/* Quick routes + button row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <span className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold">Quick:</span>
              {QUICK_ROUTES.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuick(r)}
                  className="text-[11px] px-3 py-1.5 bg-surface-container-low border border-outline-variant/15 rounded-full text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {r.location_name}
                </button>
              ))}
            </div>

            {/* Button on the right */}
            <button
              type="submit"
              disabled={loading}
              className="btn-press px-8 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[17px]">
                {loading ? 'hourglass_top' : 'radar'}
              </span>
              {loading ? 'Analyzing...' : 'Predict Traffic'}
            </button>
          </div>

          {error && (
            <p className="text-[11px] text-error flex items-center gap-1.5 -mt-2">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LocationInput;
