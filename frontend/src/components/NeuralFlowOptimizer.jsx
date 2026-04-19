import React from 'react';

const NeuralFlowOptimizer = () => {
  return (
    <div className="flex-1 relative h-full w-full flex overflow-hidden bg-surface-container-lowest">
      {/* Interactive Map Area (Left side) */}
      <div className="flex-grow relative h-full">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          title="Dark, stylized aerial view of city streets at night with glowing neon traffic flows resembling neural networks" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3TeKR6WhlAl8-SWlDCcHAxvstkkNbJDUsq5j3v17vzqAZyA2Mkgu0HcQ7q7hd_Mext_4Njh17blrmPUjhuID3cTdXxrXXIQNa72l1f5v6bOiyOctgtyPuff5o7Xx1m6Iw4szmlxMRGEBVrrFTO1hdW42P3yD5GCiBnt0VLXRegSUVTCdKiANwfOA94yc973hRiSCXgeeeuiwQNx-581lbTe5Cbh25GYRaC9MkBcHMT9JKIevipgRQy7G9L3_LC18jwOXNFyXz4Ow')" }}
        >
          {/* Overlay to ensure text readability and dark aesthetic */}
          <div className="absolute inset-0 bg-[#131314]/80 mix-blend-multiply"></div>
          {/* Glowing Route SVG Overlay (Abstract representation) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path className="drop-shadow-[0_0_8px_rgba(0,244,254,0.8)]" d="M20,80 Q40,40 50,50 T80,20" fill="none" stroke="url(#route-gradient)" strokeLinecap="round" strokeWidth="0.8"></path>
            {/* Origin Node */}
            <circle className="drop-shadow-[0_0_10px_rgba(0,244,254,1)]" cx="20" cy="80" fill="#00f4fe" r="1.5"></circle>
            {/* Destination Node */}
            <circle className="drop-shadow-[0_0_10px_rgba(200,191,255,1)]" cx="80" cy="20" fill="#c8bfff" r="1.5"></circle>
            <defs>
              <linearGradient id="route-gradient" x1="0%" x2="100%" y1="100%" y2="0%">
                <stop offset="0%" stopColor="#00f4fe"></stop>
                <stop offset="100%" stopColor="#c8bfff"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Floating Map Controls */}
        <div className="absolute top-8 left-8 bg-[#353436]/60 backdrop-blur-[24px] rounded-xl p-4 flex flex-col gap-6 shadow-[0_40px_80px_rgba(229,226,227,0.05)] border border-[#474557]/15 max-w-sm">
          <div>
            <h2 className="text-[1.75rem] font-headline font-semibold text-on-surface tracking-[-0.02em] leading-tight">Neural Flow</h2>
            <p className="text-primary text-[0.75rem] uppercase tracking-[0.1em] font-medium mt-1">Route Optimization Active</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg">
              <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>trip_origin</span>
              <div>
                <p className="text-[0.75rem] text-on-surface-variant uppercase tracking-wider">Origin</p>
                <p className="text-sm font-medium text-on-surface">Indiranagar</p>
              </div>
            </div>
            <div className="w-px h-4 bg-outline-variant/30 ml-7"></div>
            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <div>
                <p className="text-[0.75rem] text-on-surface-variant uppercase tracking-wider">Destination</p>
                <p className="text-sm font-medium text-on-surface">Whitefield Tech Park</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Predictive Intelligence Panel (Right side) */}
      <div className="w-full md:w-[420px] h-full bg-surface-container-high border-l border-outline-variant/15 flex flex-col shadow-[0_40px_80px_rgba(229,226,227,0.05)] z-10 shrink-0">
        {/* Panel Header */}
        <div className="p-8 bg-[#353436]/60 backdrop-blur-[24px] border-b border-outline-variant/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-headline font-medium text-on-surface">Optimization Matrix</h3>
            <span className="px-3 py-1 bg-secondary-fixed-dim/20 text-secondary-fixed-dim rounded-full text-xs font-semibold uppercase tracking-wider">98% Confidence</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-[3.5rem] font-headline font-bold text-on-surface tracking-[-0.02em] leading-none text-shadow-[0_0_20px_rgba(200,191,255,0.4)]">42</span>
            <span className="text-lg text-on-surface-variant font-medium">min</span>
          </div>
          <p className="text-sm text-on-surface-variant mt-2">Predicted arrival time considering dynamic variables.</p>
        </div>
        
        {/* Panel Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
          {/* Optimization Slider Section */}
          <section className="flex flex-col gap-6">
            <h4 className="text-[0.75rem] text-on-surface-variant uppercase tracking-[0.1em] font-semibold">Algorithm Balance</h4>
            <div className="bg-surface-container-low p-6 rounded-xl border border-[#474557]/15">
              <div className="flex justify-between text-xs font-medium text-on-surface-variant mb-4">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">eco</span> Eco-Priority</span>
                <span className="flex items-center gap-1">Speed-Priority <span className="material-symbols-outlined text-sm">bolt</span></span>
              </div>
              <div className="relative w-full h-2 bg-surface-container-lowest rounded-full mt-2">
                <div className="absolute top-0 left-0 h-full w-[70%] bg-gradient-to-r from-secondary-container to-primary rounded-full"></div>
                <input className="absolute top-[-8px] w-full h-6 appearance-none bg-transparent outline-none cursor-pointer" max="100" min="0" type="range" defaultValue="70"/>
              </div>
              <div className="mt-6 flex gap-4 text-sm">
                <div className="flex-1 bg-surface rounded-lg p-3">
                  <p className="text-xs text-on-surface-variant mb-1">Estimated C02</p>
                  <p className="font-medium text-tertiary">2.4 kg</p>
                </div>
                <div className="flex-1 bg-surface rounded-lg p-3">
                  <p className="text-xs text-on-surface-variant mb-1">Time Saved</p>
                  <p className="font-medium text-secondary-container">+14 min</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Congestion Reasons Section */}
          <section className="flex flex-col gap-6">
            <h4 className="text-[0.75rem] text-on-surface-variant uppercase tracking-[0.1em] font-semibold">AI Congestion Analysis</h4>
            <div className="flex flex-col gap-4">
              {/* Insight Card 1 */}
              <div className="bg-surface-container-low p-5 rounded-xl flex gap-4 items-start border border-[#474557]/15 transition-all hover:bg-surface-bright">
                <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary mt-1">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-on-surface mb-1">Monsoon Surge</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Localized flooding near HAL junction detected by visual nodes. Rerouting via inner arterial roads advised.</p>
                </div>
              </div>
              {/* Insight Card 2 */}
              <div className="bg-surface-container-low p-5 rounded-xl flex gap-4 items-start border border-[#474557]/15 transition-all hover:bg-surface-bright">
                <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                  <span className="material-symbols-outlined">corporate_fare</span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-on-surface mb-1">Tech Park Bottleneck</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Predictive model indicates shift-end exodus at Whitefield Cluster B. Expect 15% flow reduction in 20 mins.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Fixed Bottom Action */}
        <div className="p-6 bg-surface-container-high border-t border-outline-variant/10 mt-auto">
          <button className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">rocket_launch</span>
            Engage Neural Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeuralFlowOptimizer;
