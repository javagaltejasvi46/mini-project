import React from 'react';

const PredictiveHub = () => {
  return (
    <main className="flex-1 md:ml-64 pt-24 px-6 md:px-10 pb-12 w-full max-w-7xl mx-auto flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-[3.5rem] leading-none font-black tracking-[-0.02em] text-on-surface mb-2">Predictive Hub</h1>
          <p className="text-body text-on-surface-variant max-w-xl">Quantum forecasting model active. Simulating traffic densities across 4,200 urban nodes for the next 24 hours with 96.4% confidence.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/15 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-container text-xl">schedule</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold">Time Horizon</span>
              <span className="text-sm font-medium text-on-surface">24 Hours Ahead</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
        {/* Primary Wave Graph Span */}
        <div className="lg:col-span-8 bg-surface-container-high rounded-xl shadow-[0_40px_80px_rgba(229,226,227,0.05)] overflow-hidden flex flex-col relative border border-outline-variant/15">
          <div className="bg-[#353436]/60 backdrop-blur-[24px] px-6 py-4 flex justify-between items-center absolute top-0 w-full z-10 border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">waves</span>
              <h2 className="text-headline font-semibold text-on-surface tracking-tight">System Flow Density Forecast</h2>
            </div>
            <div className="flex gap-2">
              <span className="bg-secondary-fixed-dim/20 text-secondary-fixed-dim text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-semibold border border-secondary-fixed-dim/30">Stable Phase</span>
            </div>
          </div>
          <div className="p-6 pt-20 flex-1 relative min-h-[400px]">
            {/* Placeholder for actual sophisticated graph, using a styled div to represent the UI feel */}
            <div className="absolute inset-x-6 top-24 bottom-12 flex items-end">
              <div 
                className="w-full h-full bg-cover bg-center opacity-30 mix-blend-screen grayscale-[50%] sepia-[20%] hue-rotate-[220deg] rounded-lg" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')" }}
                title="abstract glowing neon blue and purple wave graph representing data flow on dark background"
              ></div>
              {/* Overlay gradient to give it depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent"></div>
              {/* Axis Labels (Simulated) */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-[11px] text-outline font-medium px-2">
                <span>NOW</span>
                <span>+4H</span>
                <span>+8H</span>
                <span>+12H</span>
                <span>+16H</span>
                <span>+24H</span>
              </div>
            </div>
            {/* Hover Insight Simulation */}
            <div className="absolute left-1/3 top-1/3 bg-surface-container-highest/80 backdrop-blur-md border border-primary/30 p-4 rounded-xl shadow-2xl z-20 w-48">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#c8bfff]"></div>
                <span className="text-xs font-semibold text-primary">14:00 Peak</span>
              </div>
              <div className="text-3xl font-black tracking-tight text-on-surface mb-1 bg-gradient-to-br from-[#c8bfff] to-[#582cff] bg-clip-text text-transparent">84%</div>
              <div className="text-[11px] text-on-surface-variant leading-tight">Predicted density spike in Sector 7 due to event dispersal.</div>
            </div>
          </div>
        </div>
        
        {/* Side Panel: Anomaly Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Confidence Score */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/15 flex items-center justify-between shadow-[0_40px_80px_rgba(229,226,227,0.05)]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold mb-1">Model Confidence</span>
              <span className="text-3xl font-black text-on-surface tracking-[-0.02em]">96.4<span className="text-xl text-outline-variant">%</span></span>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-surface-container-high border-t-primary border-r-primary flex items-center justify-center transform rotate-45">
              <span className="material-symbols-outlined text-primary -rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
          
          {/* Anomaly Stack */}
          <div className="flex-1 bg-surface-container-high rounded-xl shadow-[0_40px_80px_rgba(229,226,227,0.05)] p-6 flex flex-col border border-outline-variant/15">
            <h3 className="text-headline text-lg font-semibold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">warning</span>
              Predicted Anomalies
            </h3>
            <div className="flex flex-col gap-4">
              {/* Alert Card 1 */}
              <div className="bg-surface-container-highest/50 p-4 rounded-lg border-l-2 border-tertiary hover:bg-surface-bright transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-tertiary tracking-wide">HIGH PROBABILITY</span>
                  <span className="text-[10px] text-outline font-medium bg-surface px-2 py-0.5 rounded">T+06:00</span>
                </div>
                <h4 className="text-sm font-medium text-on-surface mb-1 group-hover:text-tertiary transition-colors">Gridlock: Alpha Node</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Weather system convergence expected to reduce arterial flow by 42%.</p>
              </div>
              {/* Alert Card 2 */}
              <div className="bg-surface-container-highest/50 p-4 rounded-lg border-l-2 border-secondary-container hover:bg-surface-bright transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-secondary-container tracking-wide">OPPORTUNITY</span>
                  <span className="text-[10px] text-outline font-medium bg-surface px-2 py-0.5 rounded">T+11:00</span>
                </div>
                <h4 className="text-sm font-medium text-on-surface mb-1 group-hover:text-secondary-container transition-colors">Optimal Reroute: Delta</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Early clearing of Sector 4 allows preemptive flow diversion.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Row: Sector Details */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sector Card 1 */}
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-on-surface">North Corridor</span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-sm">north_east</span>
            </div>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-2xl font-bold text-on-surface tracking-tight">Normal</span>
              <span className="text-xs text-secondary-fixed-dim mb-1 flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_downward</span> 12%</span>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-secondary-fixed-dim h-full w-[35%]"></div>
            </div>
          </div>
          {/* Sector Card 2 */}
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover:border-tertiary/30 transition-all group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-on-surface">Central Hub</span>
              <span className="material-symbols-outlined text-outline group-hover:text-tertiary transition-colors text-sm">north_east</span>
            </div>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-2xl font-bold text-tertiary tracking-tight">Elevated</span>
              <span className="text-xs text-tertiary mb-1 flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> 8%</span>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full w-[78%]"></div>
            </div>
          </div>
          {/* Sector Card 3 */}
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-on-surface">West Arterial</span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-sm">north_east</span>
            </div>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-2xl font-bold text-on-surface tracking-tight">Optimal</span>
              <span className="text-xs text-outline mb-1 flex items-center"><span className="material-symbols-outlined text-[14px]">horizontal_rule</span> 0%</span>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[25%]"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PredictiveHub;
