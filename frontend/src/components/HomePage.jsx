import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-[#131314]/60 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-[#c8bfff]">Obsidian Oracle</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-['Inter'] antialiased tracking-tight">
          <a className="text-white/60 hover:text-white transition-colors hover:bg-white/5 px-3 py-2 rounded-md" href="#">Network</a>
          <a className="text-white/60 hover:text-white transition-colors hover:bg-white/5 px-3 py-2 rounded-md" href="#">Insights</a>
          <a className="text-white/60 hover:text-white transition-colors hover:bg-white/5 px-3 py-2 rounded-md" href="#">Predict</a>
          <a className="text-white/60 hover:text-white transition-colors hover:bg-white/5 px-3 py-2 rounded-md" href="#">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-primary hover:text-white transition-colors text-sm font-medium tracking-wide">Sign In</button>
          <button onClick={() => navigate('/signup')} className="btn-primary px-6 py-2 rounded-xl text-sm font-semibold tracking-wide active:scale-95 transition-transform">Get Access</button>
        </div>
      </nav>
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-6 lg:px-24">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <img alt="Abstract glowing neural network map over a dark cityscape, cyan and purple neon lines representing data flow, cinematic high tech vibe" className="w-full h-full object-cover mix-blend-screen" data-alt="Abstract glowing neural network map over a dark cityscape, cyan and purple neon lines representing data flow, cinematic high tech vibe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUkzRj7iQ06ZWTeTTrRy7gy6wnB7fdvXrTnsL3JfOS2dTcfUExBcYf4AeXCQDtZRfiYEm2kdnNJL0h4RewGjVgEqxdS0lVmC7WiWm2-fACZNYWy0fimCXOoaKj1bW2CpjNKRnFVIL8xI344QhfXKzjl4UK6ntyb-b59bfJohPEsJBOv-rwkSpM2pzLbgTojwdsiZR77yRe58C4x6d3l6BXfcA9ZZH68cBbxtJ82EMpy0a9Jb40u1mXXSUn2JDtv6p_DfAS20h0h44" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/50 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
            <span className="inline-block py-1 px-4 rounded-full bg-surface-container-high/50 border border-outline-variant/20 text-secondary-container text-xs font-bold tracking-[0.1em] uppercase mb-4 glass-panel">
              Sanjaya Insight Engine v2.0
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-on-surface">
              Master the <span className="gradient-text">Flow.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed">
              Harness predictive intelligence to untangle the complexity of modern urban mobility. See the future of traffic before it happens.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={() => navigate('/signup')} className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold w-full sm:w-auto shadow-[0_20px_40px_rgba(200,191,255,0.15)]">
                Request Access
              </button>
              <button className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors text-lg font-medium px-8 py-4 w-full sm:w-auto">
                <span className="material-symbols-outlined text-2xl">play_circle</span>
                Watch Demo
              </button>
            </div>
          </div>
        </section>
        {/* Bento Grid Features */}
        <section className="py-24 px-6 lg:px-24 bg-surface relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-4">Architectural Supremacy</h2>
              <p className="text-on-surface-variant max-w-xl">Our neural architecture processing millions of data points to deliver unparalleled predictive clarity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
              {/* Feature 1: Large Span */}
              <div className="md:col-span-2 bg-surface-container-low rounded-[24px] p-8 relative overflow-hidden group hover:bg-surface-container-high transition-colors duration-500 flex flex-col justify-between">
                <div className="relative z-10 max-w-md">
                  <span className="material-symbols-outlined text-4xl text-secondary-container mb-4 block">insights</span>
                  <h3 className="text-2xl font-bold mb-2">Real-time Intelligence</h3>
                  <p className="text-on-surface-variant">Continuous ingestion of multi-modal sensory data streams provides an unblinking eye on grid dynamics.</p>
                </div>
                {/* Abstract Visual */}
                <div className="absolute right-0 bottom-0 w-2/3 h-2/3 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                  <img alt="Abstract digital representation of data streams, purple and cyan lines flowing horizontally on dark background" className="w-full h-full object-cover mask-image-gradient" data-alt="Abstract digital representation of data streams, purple and cyan lines flowing horizontally on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEFD7lT0D0qwVk_9_a7C0FAfv1gwMVIWHMYkH0mmUsFGhlSo-yPe29RbJqhBGHwvC50e1IasMHlVJHXPngj5eaKK37nso1BOPU1hcszc14qOMCH4XYnkf5grlHi6JggLMaFFM9FeNoxK34ss-_Y1W-UBHAHyOASZEgkNaenB1YzEA1LtncsDSiUaecInu-dz7icK7ChZY1EK79XtGs2a9qr_XQRN_bu6qGbTzftvO2sQNwYt3pH6h6tbyokUh_MJ3_1KyqjW431a8" style={{WebkitMaskImage: 'linear-gradient(to top right, transparent, black)'}} />
                </div>
              </div>
              {/* Feature 2: Tall */}
              <div className="md:row-span-2 bg-surface-container-low rounded-[24px] p-8 relative overflow-hidden group hover:bg-surface-container-high transition-colors duration-500 flex flex-col">
                <div className="relative z-10 mb-8">
                  <span className="material-symbols-outlined text-4xl text-primary mb-4 block">radar</span>
                  <h3 className="text-2xl font-bold mb-2">Predictive Precision</h3>
                  <p className="text-on-surface-variant">Proprietary deep learning models forecast congestion patterns up to 72 hours in advance with 94% accuracy.</p>
                </div>
                <div className="mt-auto relative w-full aspect-square rounded-xl overflow-hidden glass-panel flex items-center justify-center flex-col gap-4">
                  <span className="text-6xl font-black text-white tracking-tighter">94<span className="text-3xl text-primary">%</span></span>
                  <span className="text-xs font-bold tracking-[0.1em] text-on-surface-variant uppercase">Confidence Score</span>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="bg-surface-container-low rounded-[24px] p-8 relative overflow-hidden group hover:bg-surface-container-high transition-colors duration-500">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <span className="material-symbols-outlined text-4xl text-tertiary mb-4 block">hub</span>
                    <h3 className="text-2xl font-bold mb-2">Seamless Integration</h3>
                    <p className="text-on-surface-variant text-sm">RESTful APIs and direct database connectors for effortless deployment into existing operational stacks.</p>
                  </div>
                  <div className="mt-6 flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-surface-container-highest rounded-full text-xs text-on-surface-variant">REST API</span>
                    <span className="px-3 py-1 bg-surface-container-highest rounded-full text-xs text-on-surface-variant">GraphQL</span>
                    <span className="px-3 py-1 bg-surface-container-highest rounded-full text-xs text-on-surface-variant">WebSockets</span>
                  </div>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="bg-surface-container-low rounded-[24px] p-8 relative overflow-hidden group hover:bg-surface-container-high transition-colors duration-500">
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                  <span className="material-symbols-outlined text-5xl text-on-surface mb-6 opacity-50 group-hover:opacity-100 transition-opacity">security</span>
                  <h3 className="text-xl font-bold mb-2">Military-Grade Security</h3>
                  <p className="text-on-surface-variant text-sm">End-to-end encryption ensures your operational telemetry remains strictly confidential.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#0e0e0f] border-t border-[#474557]/15">
        <div className="font-black text-[#c8bfff]">Obsidian Oracle</div>
        <div className="flex gap-6 font-['Inter'] text-sm tracking-wide">
          <a className="text-white/40 hover:text-[#c8bfff] transition-colors opacity-100 hover:opacity-80" href="#">Privacy Policy</a>
          <a className="text-white/40 hover:text-[#c8bfff] transition-colors opacity-100 hover:opacity-80" href="#">Terms of Service</a>
          <a className="text-white/40 hover:text-[#c8bfff] transition-colors opacity-100 hover:opacity-80" href="#">System Status</a>
          <a className="text-white/40 hover:text-[#c8bfff] transition-colors opacity-100 hover:opacity-80" href="#">API Documentation</a>
        </div>
        <div className="text-sm text-white/40 font-['Inter'] tracking-wide">
          © 2024 Obsidian Oracle AI. Predictive Flow Intelligence.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
