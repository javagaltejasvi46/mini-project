import React, { useState, useEffect } from 'react';
import { api } from '../api';
import LocationInput from './LocationInput';
import TrafficInfo from './TrafficInfo';
import TrafficChart from './TrafficChart';
import AlternateRoutes from './AlternateRoutes';
import NearbyTraffic from './NearbyTraffic';

const MainContent = () => {
  const [health, setHealth] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [nearbyTraffic, setNearbyTraffic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLive, setFetchingLive] = useState(false);
  const [error, setError] = useState(null);

  // Poll health every 30s
  useEffect(() => {
    const check = () => api.health().then(setHealth).catch(() => setHealth({ status: 'unreachable' }));
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (locationData) => {
    setLoading(true);
    setError(null);
    setTrafficData(null);
    setRoutesData(null);
    setNearbyTraffic(null);

    try {
      // Predict traffic at origin
      const predict = await api.predict({
        location_name: locationData.location_name,
        latitude: locationData.start_lat,
        longitude: locationData.start_lon,
      });
      setTrafficData(predict);

      // Routes + nearby in parallel
      const [routesResult, nearbyResult] = await Promise.allSettled([
        api.findRoutes({
          start_lat: locationData.start_lat,
          start_lon: locationData.start_lon,
          end_lat: locationData.end_lat,
          end_lon: locationData.end_lon,
        }),
        api.traffic(locationData.start_lat, locationData.start_lon, 2),
      ]);

      if (routesResult.status === 'fulfilled') setRoutesData(routesResult.value);
      if (nearbyResult.status === 'fulfilled') setNearbyTraffic(nearbyResult.value);
    } catch (e) {
      setError('Failed to fetch traffic data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLive = async () => {
    setFetchingLive(true);
    try {
      const res = await api.fetchLiveData();
      alert(res.status === 'success'
        ? `✅ Data fetched for ${res.locations} locations!`
        : `❌ ${res.message}`);
    } catch {
      alert('Failed to fetch live data.');
    } finally {
      setFetchingLive(false);
    }
  };

  const healthColor = !health ? '#928ea3'
    : health.status === 'healthy' ? '#00dce5'
    : health.status === 'unreachable' ? '#ffb4ab'
    : '#fbbc04';

  const congestionIndex = trafficData ? trafficData.current_traffic_level : null;
  const confidence = trafficData ? Math.round(trafficData.prediction_confidence * 100) : null;

  return (
    <main className="flex-1 relative bg-surface-dim overflow-y-auto">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1517502474148-c8bc983e230d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity pointer-events-none"
      ></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-surface via-surface/80 to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 p-8 flex flex-col gap-8">
        {/* Top row: hero + metrics */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: hero */}
          <div className="flex-1 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-primary text-[0.75rem] uppercase tracking-[0.1em] font-medium block mb-2">Live Telemetry</span>
              <h1 className="text-[3rem] font-bold text-white tracking-[-0.02em] leading-none mb-3">
                {trafficData ? trafficData.location : 'Oracle Dashboard'}
              </h1>
              <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
                {trafficData
                  ? trafficData.traffic_reason
                  : 'Enter a route below to get real-time traffic predictions powered by AI.'}
              </p>
            </div>

            {/* Health + Fetch Live */}
            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/15">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: healthColor }}></span>
                <span className="text-xs font-medium text-on-surface-variant">
                  {health?.status === 'healthy' ? `Backend Online · DB ${health.database} · Scheduler ${health.scheduler}` :
                   health?.status === 'unreachable' ? 'Backend Offline' : 'Checking...'}
                </span>
              </div>
              <button
                onClick={handleFetchLive}
                disabled={fetchingLive}
                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/15 text-xs font-medium text-secondary-container hover:bg-surface-bright transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">sync</span>
                {fetchingLive ? 'Fetching...' : 'Fetch Live Data'}
              </button>
            </div>
          </div>

          {/* Right: metric cards */}
          <div className="w-full lg:w-[380px] flex flex-col gap-4 shrink-0">
            {/* Congestion Index */}
            <div className="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/10">
              <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-5 py-3 flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">
                  {trafficData ? 'Congestion Index' : 'Global Congestion Index'}
                </h3>
                <span className="material-symbols-outlined text-tertiary text-[18px]">warning</span>
              </div>
              <div className="p-5">
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-[3rem] font-bold tracking-[-0.02em] leading-none text-white">
                    {congestionIndex ?? '—'}
                  </span>
                  <span className="text-on-surface-variant text-sm mb-1">/ 100</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-lowest rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-700"
                    style={{ width: `${congestionIndex ?? 0}%` }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full"></div>
                </div>
                <div className="flex justify-between mt-1.5 text-[0.65rem] text-outline uppercase tracking-wider">
                  <span>Optimal</span>
                  <span>Critical</span>
                </div>
              </div>
            </div>

            {/* AI Confidence */}
            <div className="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/10">
              <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-5 py-3 flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-secondary-container">AI Confidence Level</h3>
                <span className="material-symbols-outlined text-secondary-container text-[18px]">memory</span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-sm">Prediction Accuracy</span>
                  <span className="text-white font-medium text-lg">{confidence != null ? `${confidence}%` : '—'}</span>
                </div>
                {trafficData && (
                  <>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-full text-xs font-medium border border-secondary-container/20">
                        {confidence >= 80 ? 'High Reliability' : confidence >= 60 ? 'Moderate Reliability' : 'Low Reliability'}
                      </span>
                      <span className="bg-surface-container-lowest text-outline px-3 py-1 rounded-full text-xs border border-outline-variant/20">
                        {trafficData.cause}
                      </span>
                    </div>
                    <p className="text-[0.8rem] text-on-surface-variant leading-relaxed">
                      Expected delay: <span className="text-tertiary font-semibold">{trafficData.predicted_delay.toFixed(1)} min</span>
                    </p>
                  </>
                )}
                {!trafficData && (
                  <p className="text-[0.8rem] text-on-surface-variant leading-relaxed">
                    Submit a route to see AI prediction confidence.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Route Input */}
        <LocationInput onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="bg-error-container/20 border border-error/30 text-error rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-on-surface-variant text-sm">Analyzing traffic patterns...</p>
          </div>
        )}

        {/* Results */}
        {trafficData && !loading && (
          <div className="flex flex-col gap-6">
            <TrafficInfo data={trafficData} />
            <TrafficChart data={trafficData.traffic_data} />
            <AlternateRoutes routesData={routesData} recommendations={trafficData.recommendations} />
            {nearbyTraffic && nearbyTraffic.length > 0 && (
              <NearbyTraffic data={nearbyTraffic} />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;
