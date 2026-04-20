import React, { useState, useRef, useEffect } from 'react';
import { useNominatim } from '../hooks/useNominatim';

/**
 * PlaceSearchInput
 * Props:
 *   label        — string, e.g. "Origin"
 *   dotColor     — tailwind class for the indicator dot, e.g. "bg-secondary-fixed-dim"
 *   dotGlow      — inline style string for box-shadow glow
 *   icon         — Material Symbol name, e.g. "trip_origin"
 *   iconColor    — tailwind text color class
 *   placeholder  — input placeholder
 *   value        — { name, lat, lon } | null
 *   onChange     — (value: { name, lat, lon }) => void
 *   onGeolocate  — optional, shows "Use My Location" button if provided
 */
const PlaceSearchInput = ({ label, dotColor, dotGlow, icon, iconColor, placeholder, value, onChange, onGeolocate }) => {
  const [query, setQuery] = useState(value?.name || '');
  const [open, setOpen] = useState(false);
  const { suggestions, searching, search, clear } = useNominatim();
  const wrapRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync external value name into input
  useEffect(() => {
    if (value?.name && value.name !== query) setQuery(value.name);
  }, [value?.name]);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    setOpen(true);
    search(q);
    // Clear resolved coords when user edits
    if (value?.lat) onChange({ name: q, lat: null, lon: null });
  };

  const handleSelect = (s) => {
    setQuery(s.display);
    onChange({ name: s.display, lat: s.lat, lon: s.lon });
    clear();
    setOpen(false);
  };

  const resolved = value?.lat != null;

  return (
    <div className="flex flex-col gap-1.5" ref={wrapRef}>
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} style={{ boxShadow: dotGlow }}></span>
          <span className="text-[0.65rem] uppercase tracking-[0.1em] font-semibold text-on-surface-variant">{label}</span>
        </div>
        {onGeolocate && (
          <button
            type="button"
            onClick={onGeolocate}
            className="flex items-center gap-1 text-[10px] text-on-surface-variant hover:text-secondary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">my_location</span>
            My Location
          </button>
        )}
      </div>

      {/* Input */}
      <div className="relative">
        <div className={`flex items-center gap-2 bg-surface-container-low rounded-lg border transition-colors px-3 py-2.5 ${resolved ? 'border-secondary-fixed-dim/50' : 'border-outline-variant/35 focus-within:border-primary/60'}`}>
          <span className={`material-symbols-outlined text-[18px] flex-shrink-0 ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          <input
            className="bg-transparent border-none outline-none text-sm text-on-surface flex-1 placeholder:text-outline/50 min-w-0"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={() => { if (suggestions.length) setOpen(true); }}
            autoComplete="off"
          />
          {searching && (
            <span className="w-3.5 h-3.5 border border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0"></span>
          )}
          {resolved && !searching && (
            <span className="material-symbols-outlined text-primary text-[14px] flex-shrink-0">check_circle</span>
          )}
        </div>

        {/* Resolved coords pill */}
        {resolved && (
          <div className="mt-1 flex items-center gap-1.5 px-1">
            <span className="material-symbols-outlined text-[11px] text-outline">location_on</span>
            <span className="text-[10px] text-outline font-mono">{value.lat.toFixed(5)}, {value.lon.toFixed(5)}</span>
          </div>
        )}

        {/* Dropdown */}
        {open && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-highest border border-outline-variant/20 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => handleSelect(s)}
                className="w-full text-left px-4 py-3 text-sm text-on-surface hover:bg-surface-bright transition-colors border-b border-outline-variant/10 last:border-0 flex items-start gap-2"
              >
                <span className="material-symbols-outlined text-outline text-[14px] mt-0.5 flex-shrink-0">location_on</span>
                <span className="leading-snug">{s.display}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceSearchInput;
