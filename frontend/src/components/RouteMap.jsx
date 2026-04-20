import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';

// Route colors matching the app's design tokens
const ROUTE_COLORS = ['#00dce5', '#c8bfff', '#ffb59c'];
const ROUTE_COLORS_DIM = ['#00dce540', '#c8bfff40', '#ffb59c40'];

// Fit map bounds to the selected route whenever it changes
const BoundsFitter = ({ routes, selectedIndex }) => {
  const map = useMap();
  useEffect(() => {
    const route = routes?.[selectedIndex];
    if (!route?.coordinates?.length) return;
    try {
      map.fitBounds(route.coordinates, { padding: [40, 40], maxZoom: 15 });
    } catch {}
  }, [routes, selectedIndex, map]);
  return null;
};

/**
 * RouteMap
 * Props:
 *   routes        — array of RouteInfo from /routes/find
 *   selectedIndex — which route is currently selected
 *   onSelect      — (index) => void
 *   height        — CSS height string, default '320px'
 */
const RouteMap = ({ routes, selectedIndex = 0, onSelect, height = '320px' }) => {
  if (!routes || routes.length === 0) return null;

  // Default center: midpoint of selected route
  const selected = routes[selectedIndex];
  const midIdx = Math.floor(selected.coordinates.length / 2);
  const center = selected.coordinates[midIdx] || [12.97, 77.59];

  return (
    <div
      className="rounded-xl overflow-hidden border border-outline-variant/15"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', background: '#131314' }}
        zoomControl={true}
        attributionControl={false}
      >
        {/* Dark map tiles — CartoDB Dark Matter, no API key needed */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        <BoundsFitter routes={routes} selectedIndex={selectedIndex} />

        {/* Draw all routes, selected one on top */}
        {routes.map((route, i) => {
          const isSelected = i === selectedIndex;
          return (
            <Polyline
              key={i}
              positions={route.coordinates}
              pathOptions={{
                color: isSelected ? ROUTE_COLORS[i % ROUTE_COLORS.length] : '#474557',
                weight: isSelected ? 5 : 2,
                opacity: isSelected ? 0.95 : 0.4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{ click: () => onSelect?.(i) }}
            >
              <Tooltip sticky>
                {i === 0 ? '⭐ Best Route' : `Alternative ${i}`} ·{' '}
                {route.distance.toFixed(1)} km · {Math.round(route.estimated_time + route.predicted_delay)} min
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Origin marker */}
        {selected.coordinates.length > 0 && (
          <CircleMarker
            center={selected.coordinates[0]}
            radius={8}
            pathOptions={{ color: '#00dce5', fillColor: '#00dce5', fillOpacity: 1, weight: 2 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>Origin</Tooltip>
          </CircleMarker>
        )}

        {/* Destination marker */}
        {selected.coordinates.length > 1 && (
          <CircleMarker
            center={selected.coordinates[selected.coordinates.length - 1]}
            radius={8}
            pathOptions={{ color: '#c8bfff', fillColor: '#c8bfff', fillOpacity: 1, weight: 2 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>Destination</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
