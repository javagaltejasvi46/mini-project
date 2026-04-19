import React from 'react';

const MainContent = () => {
  return (
    <main className="flex-1 relative bg-surface-dim overflow-hidden block">
      {/* 3D Map Background Concept */}
      <div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1517502474148-c8bc983e230d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" 
        data-alt="abstract glowing 3d isometric map of bangalore at night with pulsing indigo and cyan light trails indicating data flow, highly detailed futuristic interface element"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface/80 to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 p-8 h-full flex flex-col lg:flex-row gap-8">
        {/* Center/Left Canvas (Map Area) */}
        <div className="flex-1 flex flex-col justify-end pb-12 relative">
          <div className="max-w-2xl">
            <span className="text-primary text-[0.75rem] uppercase tracking-[0.1em] font-medium block mb-2">Live Telemetry</span>
            <h1 className="text-[3.5rem] font-bold text-white tracking-[-0.02em] leading-none mb-4">Sector 7 Alpha</h1>
            <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
              Anomalous congestion detected along the Outer Ring Road corridor. AI models predict normalization within 47 minutes.
            </p>
          </div>
          
          {/* Floating Action */}
          <div className="absolute bottom-12 right-12">
            <button className="bg-surface-container-highest/60 backdrop-blur-[24px] border border-outline-variant/15 p-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] text-primary hover:text-secondary-container transition-colors group">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">my_location</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar (Metrics) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
          {/* Neural Search Bar (Floating) */}
          <div className="bg-surface-container-highest/60 backdrop-blur-[24px] rounded-full p-2 flex items-center border border-outline-variant/15 shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
            <span className="material-symbols-outlined text-primary ml-3 mr-2">travel_explore</span>
            <input 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-on-surface-variant flex-1 focus:ring-0" 
              placeholder="Enter node ID or coordinates..." 
              type="text"
            />
            <button className="bg-surface-container-low text-primary px-4 py-1.5 rounded-full text-xs font-medium hover:bg-surface-bright transition-colors">
              Target
            </button>
          </div>

          {/* Predictive Card 1 */}
          <div className="bg-surface-container-high rounded-xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.2)] flex flex-col border border-outline-variant/10">
            <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-5 py-4 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">Global Congestion Index</h3>
              <span className="material-symbols-outlined text-tertiary text-[18px]">warning</span>
            </div>
            <div className="p-6 pb-8">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-[3.5rem] font-bold tracking-[-0.02em] leading-none text-white">84</span>
                <span className="text-on-surface-variant text-sm mb-2">/ 100</span>
              </div>
              
              {/* Liquid Progress Bar Concept */}
              <div className="h-3 w-full bg-surface-container-lowest rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-[84%] bg-gradient-to-r from-primary to-tertiary rounded-full"></div>
                {/* Pseudo highlight */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full"></div>
              </div>
              <div className="flex justify-between mt-2 text-[0.65rem] text-outline uppercase tracking-wider">
                <span>Optimal</span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Predictive Card 2 */}
          <div className="bg-surface-container-high rounded-xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.2)] flex flex-col border border-outline-variant/10">
            <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-5 py-4 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-secondary-container">AI Confidence Level</h3>
              <span className="material-symbols-outlined text-secondary-container text-[18px]">memory</span>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant text-sm">Prediction Accuracy</span>
                <span className="text-white font-medium text-lg">99.2%</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-full text-xs font-medium border border-secondary-container/20">High Reliability</span>
                <span className="bg-surface-container-lowest text-outline px-3 py-1 rounded-full text-xs border border-outline-variant/20">Node Active</span>
              </div>
              <p className="text-[0.875rem] text-on-surface-variant leading-relaxed mt-2">
                Oracle systems are operating at peak efficiency. Data streams from 4,021 nodes integrated successfully.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default MainContent;
