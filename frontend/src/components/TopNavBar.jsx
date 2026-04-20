import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNominatim } from '../hooks/useNominatim';

const TopNavBar = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { suggestions, searching, search, clear } = useNominatim();
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    setOpen(true);
    search(q);
  };

  const handleSelect = (s) => {
    setQuery('');
    clear();
    setOpen(false);
    // Navigate to flow optimizer with the selected place pre-filled as origin via URL state
    navigate('/flow-optimizer', {
      state: { origin: { name: s.display, lat: s.lat, lon: s.lon } }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); clear(); }
    if (e.key === 'Enter' && suggestions.length > 0) handleSelect(suggestions[0]);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-dim/60 backdrop-blur-[24px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-8">
        <div className="text-lg font-black tracking-[-0.02em] text-primary uppercase">
          SANJAYA INSIGHT ENGINE
        </div>
        <div className="hidden md:flex gap-6 font-['Inter'] tracking-tight text-sm font-medium">
          <NavLink to="/health" className={({ isActive }) => isActive ? "text-primary hover:bg-surface-container-high/50 transition-all duration-300 px-3 py-1.5 rounded-lg border-b-2 border-primary" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 px-3 py-1.5 rounded-lg"}>Network Status</NavLink>
          <NavLink to="/flow-optimizer" className={({ isActive }) => isActive ? "text-primary hover:bg-surface-container-high/50 transition-all duration-300 px-3 py-1.5 rounded-lg border-b-2 border-primary" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 px-3 py-1.5 rounded-lg"}>Flow Analysis</NavLink>
          <NavLink to="/predictive-hub" className={({ isActive }) => isActive ? "text-primary hover:bg-surface-container-high/50 transition-all duration-300 px-3 py-1.5 rounded-lg border-b-2 border-primary" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 px-3 py-1.5 rounded-lg"}>Predictive Hub</NavLink>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search — Nominatim geocoding, navigates to Flow Optimizer */}
        <div className="relative hidden lg:block" ref={wrapRef}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
            {searching ? 'progress_activity' : 'search'}
          </span>
          <input
            className="bg-surface-container-lowest border-none outline-none text-sm text-on-surface focus:ring-0 focus:bg-surface-container-low transition-colors pl-9 pr-4 py-2 w-64 rounded-full border border-transparent focus:border-outline-variant/20 placeholder:text-outline/50"
            placeholder="Search any location..."
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length) setOpen(true); }}
          />
          {open && suggestions.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-surface-container-highest border border-outline-variant/20 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
              <p className="text-[10px] uppercase tracking-wider text-outline px-4 pt-3 pb-1 font-semibold">
                Select to open in Flow Optimizer
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
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

        <div className="flex items-center gap-4 text-primary">
          <button
            title="Notifications — coming soon"
            className="scale-[0.98] active:opacity-80 transition-transform hover:bg-surface-container-high/50 p-2 rounded-full opacity-40 cursor-not-allowed"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            title="Settings — coming soon"
            className="scale-[0.98] active:opacity-80 transition-transform hover:bg-surface-container-high/50 p-2 rounded-full opacity-40 cursor-not-allowed"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button
            title="Account — coming soon"
            className="scale-[0.98] active:opacity-80 transition-transform hover:bg-surface-container-high/50 p-2 rounded-full opacity-40 cursor-not-allowed"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
