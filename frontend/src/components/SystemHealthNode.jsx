import React from 'react';

const SystemHealthNode = () => {
  return (
    <main className="flex-1 relative pt-20 md:pt-0 overflow-hidden h-full flex flex-col">
      {/* Background Neural Network Visualization Area (Simulated) */}
      <div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" 
        title="abstract dark background with subtle glowing network lines representing a digital neural network map of bangalore traffic nodes in deep purple and cyan hues"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface z-0 pointer-events-none"></div>
      
      <div className="relative z-10 w-full h-full p-8 flex flex-col md:flex-row gap-8">
        {/* Left Column: Global Health & Active Node Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-8 h-full">
          {/* System Status Header */}
          <header>
            <h2 className="text-[1.75rem] font-bold font-headline tracking-[-0.02em] text-on-surface">System Health</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim shadow-[0_0_0_0_rgba(0,244,254,0.4)] animate-[pulse_2s_infinite]"></span>
              <span className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-secondary-fixed-dim">Network Optimal</span>
            </div>
          </header>
          
          {/* Global Metrics Bento Box */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high rounded-xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
              <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-outline mb-2">Throughput</p>
              <p className="text-3xl font-bold tracking-tight text-white">4.2 <span className="text-sm font-normal text-outline">TB/s</span></p>
            </div>
            <div className="bg-surface-container-high rounded-xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
              <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-outline mb-2">Active Nodes</p>
              <p className="text-3xl font-bold tracking-tight text-white">1,204</p>
            </div>
            <div className="col-span-2 bg-surface-container-high rounded-xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
              <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-outline mb-2">Global Error Rate</p>
              <div className="flex items-end justify-between">
                <p className="text-[3.5rem] font-bold font-headline tracking-[-0.02em] leading-none bg-gradient-to-br from-[#c8bfff] to-[#582cff] bg-clip-text text-transparent">0.03%</p>
                <span className="material-symbols-outlined text-secondary-fixed-dim mb-2 text-2xl">trending_down</span>
              </div>
            </div>
          </div>
          
          {/* Focused Node Detail Panel (Glassmorphism) */}
          <div className="mt-auto bg-[#353436]/60 backdrop-blur-[24px] rounded-xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-outline-variant/15 flex-1 max-h-[400px] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-primary mb-1">Inspecting Node</p>
                <h3 className="text-xl font-bold text-white">BNG-KRM-042</h3>
              </div>
              <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs text-outline border border-outline-variant/30">Koramangala</span>
            </div>
            
            {/* Pulse Meter Visualization */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-48 h-48 rounded-full border-4 border-surface-container-lowest relative flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-primary-container" cx="50" cy="50" fill="none" r="46" stroke="#582cff" strokeDasharray="289" strokeDashoffset="40" strokeWidth="4"></circle>
                  <circle className="text-secondary-fixed-dim opacity-60" cx="50" cy="50" fill="none" r="40" stroke="#00dce5" strokeDasharray="251" strokeDashoffset="180" strokeWidth="2"></circle>
                </svg>
                <div className="text-center">
                  <p className="text-sm text-outline mb-1">Load</p>
                  <p className="text-2xl font-bold text-white">86%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between border-t border-outline-variant/15 pt-4">
              <div>
                <p className="text-xs text-outline">Latency</p>
                <p className="text-sm font-semibold text-white">12ms</p>
              </div>
              <div>
                <p className="text-xs text-outline">Packets Drop</p>
                <p className="text-sm font-semibold text-white">0.001%</p>
              </div>
              <div>
                <p className="text-xs text-outline">Status</p>
                <p className="text-sm font-semibold text-secondary-fixed-dim">Stable</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Map / Neural Visualization Area */}
        <div className="w-full md:w-2/3 h-full rounded-xl bg-surface-container-low relative overflow-hidden border border-outline-variant/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
          {/* Map Layer */}
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-luminosity opacity-20" 
            title="dark high contrast satellite map view of bangalore city streets at night used as a backdrop for data visualization"
          ></div>
          
          {/* Map UI Overlays */}
          <div className="absolute top-6 left-6 flex gap-2">
            <button className="bg-surface-container-highest/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm border border-outline-variant/20 hover:bg-surface-bright transition-colors">All Nodes</button>
            <button className="bg-surface-container-lowest/80 backdrop-blur-md text-outline px-4 py-2 rounded-full text-sm border border-transparent hover:text-white transition-colors">Critical</button>
            <button className="bg-surface-container-lowest/80 backdrop-blur-md text-outline px-4 py-2 rounded-full text-sm border border-transparent hover:text-white transition-colors">Offline</button>
          </div>
          <div className="absolute bottom-6 right-6 bg-surface-container-highest/80 backdrop-blur-md p-4 rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-outline">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span> Optimal
              </div>
              <div className="flex items-center gap-2 text-xs text-outline">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span> Congested
              </div>
              <div className="flex items-center gap-2 text-xs text-outline">
                <span className="w-2 h-2 rounded-full bg-error"></span> Failure
              </div>
            </div>
          </div>
          
          {/* Simulated Node Interactive Point */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-primary relative z-10 shadow-[0_0_15px_rgba(200,191,255,0.8)]"></div>
            <div className="absolute inset-0 w-full h-full rounded-full bg-primary/40 animate-ping z-0"></div>
            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest border border-outline-variant/30 rounded-lg px-3 py-2 pointer-events-none shadow-lg">
              <p className="text-xs font-bold text-white">BNG-KRM-042</p>
              <p className="text-[10px] text-primary mt-1">Click to inspect</p>
            </div>
          </div>
          
          {/* Simulated connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path className="opacity-30" d="M 500,300 C 400,200 300,400 200,250" fill="none" stroke="#474557" strokeWidth="1"></path>
            <path className="opacity-30" d="M 500,300 C 600,400 700,200 800,350" fill="none" stroke="#474557" strokeWidth="1"></path>
            <path className="opacity-50" d="M 500,300 C 450,450 350,500 250,600" fill="none" stroke="#c8bfff" strokeWidth="2"></path>
          </svg>
        </div>
      </div>
    </main>
  );
};

export default SystemHealthNode;
