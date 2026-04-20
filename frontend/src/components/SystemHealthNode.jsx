import React, { useState, useEffect } from 'react';
import { api } from '../api';

const MONITORING_LOCATIONS = [
  { id: 'BNG-MGR-001', name: 'MG Road', lat: 12.9757, lon: 77.6011 },
  { id: 'BNG-APT-002', name: 'Airport Road', lat: 13.1986, lon: 77.7066 },
  { id: 'BNG-KRM-003', name: 'Koramangala', lat: 12.9352, lon: 77.6245 },
  { id: 'BNG-WFD-004', name: 'Whitefield', lat: 12.9698, lon: 77.7499 },
  { id: 'BNG-IND-005', name: 'Indiranagar', lat: 12.9784, lon: 77.6408 },
];

const congestionColor = (ratio) => {
  if (ratio < 1.5) return '#00dce5';
  if (ratio < 3.0) return '#ffb59c';
  return '#ffb4ab';
};

const congestionLabel = (ratio) => {
  if (ratio < 1.5) return 'Optimal';
  if (ratio < 3.0) return 'Elevated';
  return 'Critical';
};

const SystemHealthNode = () => {
  const [health, setHealth] = useState(null);
  const [nodeData, setNodeData] = useState({});
  const [selectedNode, setSelectedNode] = useState(MONITORING_LOCATIONS[0]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Nodes');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      // Health check
      const h = await api.health().catch(() => ({ status: 'unreachable' }));
      setHealth(h);

      // Fetch nearby traffic for each monitoring location
      const results = {};
      await Promise.allSettled(
        MONITORING_LOCATIONS.map(async (loc) => {
          const data = await api.traffic(loc.lat, loc.lon, 1).catch(() => []);
          results[loc.id] = data[0] || null; // take closest sensor
        })
      );
      setNodeData(results);
      setLoading(false);
    };
    fetchAll();
    const id = setInterval(fetchAll, 60000); // refresh every minute
    return () => clearInterval(id);
  }, []);

  const healthColor = !health ? '#928ea3'
    : health.status === 'healthy' ? '#00dce5'
    : health.status === 'unreachable' ? '#ffb4ab'
    : '#ffb59c';

  const activeNodes = MONITORING_LOCATIONS.filter(l => nodeData[l.id]).length;
  const selectedData = nodeData[selectedNode.id];

  const filteredNodes = MONITORING_LOCATIONS.filter(loc => {
    const d = nodeData[loc.id];
    if (filter === 'All Nodes') return true;
    if (filter === 'Critical') return d && d.congestion_ratio >= 3.0;
    if (filter === 'Offline') return !d;
    return true;
  });

  return (
    <main className="flex-1 relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full h-full p-8 flex flex-col md:flex-row gap-8 overflow-y-auto">
        {/* Left column */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <header>
            <h2 className="text-[1.75rem] font-bold tracking-[-0.02em] text-on-surface">System Health</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: healthColor }}></span>
              <span className="text-[0.75rem] font-medium tracking-[0.1em] uppercase" style={{ color: healthColor }}>
                {health?.status === 'healthy' ? 'Network Optimal' : health?.status === 'unreachable' ? 'Backend Offline' : 'Checking...'}
              </span>
            </div>
          </header>

          {/* Global metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-high rounded-xl p-5">
              <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-outline mb-2">Backend</p>
              <p className="text-2xl font-bold tracking-tight text-white capitalize">{health?.status ?? '—'}</p>
            </div>
            <div className="bg-surface-container-high rounded-xl p-5">
              <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-outline mb-2">Active Nodes</p>
              <p className="text-2xl font-bold tracking-tight text-white">{loading ? '...' : `${activeNodes} / ${MONITORING_LOCATIONS.length}`}</p>
            </div>
            <div className="bg-surface-container-high rounded-xl p-5">
              <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-outline mb-2">Database</p>
              <p className="text-2xl font-bold tracking-tight text-white capitalize">{health?.database ?? '—'}</p>
            </div>
            <div className="bg-surface-container-high rounded-xl p-5">
              <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-outline mb-2">Scheduler</p>
              <p className="text-2xl font-bold tracking-tight text-white capitalize">{health?.scheduler ?? '—'}</p>
            </div>
          </div>

          {/* Selected node detail */}
          <div className="bg-[#353436]/60 backdrop-blur-[24px] rounded-xl p-6 border border-outline-variant/15 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-primary mb-1">Inspecting Node</p>
                <h3 className="text-lg font-bold text-white">{selectedNode.id}</h3>
              </div>
              <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs text-outline border border-outline-variant/30">{selectedNode.name}</span>
            </div>

            {/* Gauge */}
            <div className="flex items-center justify-center py-4">
              <div className="w-40 h-40 rounded-full border-4 border-surface-container-lowest relative flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="46"
                    stroke={selectedData ? congestionColor(selectedData.congestion_ratio) : '#474557'}
                    strokeDasharray="289"
                    strokeDashoffset={selectedData ? 289 - (Math.min(selectedData.congestion_ratio / 5, 1) * 289) : 289}
                    strokeWidth="4"
                    style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                  />
                </svg>
                <div className="text-center">
                  <p className="text-xs text-outline mb-1">Congestion</p>
                  <p className="text-xl font-bold text-white">
                    {selectedData ? `${(selectedData.congestion_ratio * 20).toFixed(0)}` : '—'}
                  </p>
                  <p className="text-[10px]" style={{ color: selectedData ? congestionColor(selectedData.congestion_ratio) : '#928ea3' }}>
                    {selectedData ? congestionLabel(selectedData.congestion_ratio) : 'No data'}
                  </p>
                </div>
              </div>
            </div>

            {selectedData ? (
              <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/15 pt-4">
                <div className="text-center">
                  <p className="text-[10px] text-outline mb-1">Speed</p>
                  <p className="text-sm font-semibold text-white">{selectedData.current_speed.toFixed(0)} km/h</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-outline mb-1">Rain</p>
                  <p className="text-sm font-semibold text-white">{selectedData.rain > 0 ? `${selectedData.rain.toFixed(1)}mm` : 'None'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-outline mb-1">Alerts</p>
                  <p className="text-sm font-semibold" style={{ color: (selectedData.accident || selectedData.event) ? '#ffb4ab' : '#00dce5' }}>
                    {selectedData.accident ? '🚨' : selectedData.event ? '🎪' : '✓ Clear'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant text-center">No sensor data available for this node.</p>
            )}
          </div>
        </div>

        {/* Right column — node map */}
        <div className="w-full md:w-2/3 h-full rounded-xl bg-surface-container-low relative overflow-hidden border border-outline-variant/10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-luminosity opacity-15"></div>

          {/* Filter buttons */}
          <div className="absolute top-5 left-5 flex gap-2 z-10">
            {['All Nodes', 'Critical', 'Offline'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${filter === f ? 'bg-surface-container-highest/80 text-white border-outline-variant/20' : 'bg-surface-container-lowest/80 text-outline border-transparent hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-5 right-5 bg-surface-container-highest/80 backdrop-blur-md p-3 rounded-xl border border-outline-variant/20 z-10">
            <div className="flex items-center gap-4">
              {[['#00dce5', 'Optimal'], ['#ffb59c', 'Elevated'], ['#ffb4ab', 'Critical'], ['#474557', 'Offline']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-outline">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }}></span> {label}
                </div>
              ))}
            </div>
          </div>

          {/* Node dots */}
          {filteredNodes.map((loc, i) => {
            const d = nodeData[loc.id];
            const color = d ? congestionColor(d.congestion_ratio) : '#474557';
            // Spread nodes across the visualization area
            const positions = [
              { top: '50%', left: '50%' },
              { top: '25%', left: '70%' },
              { top: '65%', left: '30%' },
              { top: '35%', left: '35%' },
              { top: '55%', left: '65%' },
            ];
            const pos = positions[i % positions.length];
            return (
              <div
                key={loc.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                style={pos}
                onClick={() => setSelectedNode(loc)}
              >
                <div className="w-4 h-4 rounded-full relative z-10 shadow-[0_0_15px_rgba(200,191,255,0.8)]" style={{ background: color }}></div>
                {selectedNode.id === loc.id && (
                  <div className="absolute inset-0 w-full h-full rounded-full animate-ping z-0" style={{ background: `${color}40` }}></div>
                )}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest border border-outline-variant/30 rounded-lg px-3 py-2 pointer-events-none shadow-lg z-20">
                  <p className="text-xs font-bold text-white">{loc.id}</p>
                  <p className="text-[10px] text-on-surface-variant">{loc.name}</p>
                  {d && <p className="text-[10px] mt-0.5" style={{ color }}>{congestionLabel(d.congestion_ratio)} · {d.current_speed.toFixed(0)} km/h</p>}
                </div>
              </div>
            );
          })}

          {/* Node list overlay */}
          <div className="absolute top-16 right-5 flex flex-col gap-2 z-10 max-h-[60%] overflow-y-auto">
            {filteredNodes.map(loc => {
              const d = nodeData[loc.id];
              const color = d ? congestionColor(d.congestion_ratio) : '#474557';
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedNode(loc)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all border ${selectedNode.id === loc.id ? 'bg-surface-container-highest/80 border-outline-variant/30' : 'bg-surface-container-lowest/60 border-transparent hover:bg-surface-container-highest/60'}`}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}></span>
                  <div>
                    <p className="text-xs font-medium text-white">{loc.name}</p>
                    <p className="text-[10px] text-outline">{d ? `${d.current_speed.toFixed(0)} km/h · ${congestionLabel(d.congestion_ratio)}` : 'No data'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SystemHealthNode;
