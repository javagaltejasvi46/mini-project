import { useState, useRef, useCallback } from 'react';

// Nominatim geocoding — free, no API key, OpenStreetMap data
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

export const useNominatim = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 3) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'json',
          limit: 5,
          countrycodes: 'in',          // bias to India (Bangalore project)
          addressdetails: 1,
        });
        const res = await fetch(`${NOMINATIM}?${params}`, {
          headers: { 'Accept-Language': 'en' }
        });
        const data = await res.json();
        setSuggestions(data.map(r => ({
          display: r.display_name.split(',').slice(0, 3).join(', '),
          full: r.display_name,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
        })));
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, []);

  const clear = useCallback(() => setSuggestions([]), []);

  return { suggestions, searching, search, clear };
};
