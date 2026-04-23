import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogInPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface-container-low"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-20"></div>
      </div>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-[#131314]/80 backdrop-blur-xl shadow-2xl shadow-black/50 border-b border-transparent">
        <div className="flex items-center gap-2 text-[#c8bfff] font-bold tracking-tighter text-xl font-['Inter'] cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>dataset</span>
          <span>Obsidian Oracle</span>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-500 hover:text-[#00f4fe] transition-colors duration-300">
            <span className="material-symbols-outlined">security</span>
          </button>
          <button className="text-gray-500 hover:text-[#00f4fe] transition-colors duration-300">
            <span className="material-symbols-outlined">language</span>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 bg-gradient-to-r from-transparent via-[#1c1b1c] to-transparent h-px w-full"></div>
      </header>
      <main className="relative z-10 w-full max-w-md mx-auto p-8">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-surface-container flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(88,44,255,0.2)]">
            <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
          </div>
          <h1 className="font-headline text-3xl font-light tracking-[-0.02em] text-on-surface mb-2">SANJAYA</h1>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Insight Engine</p>
        </div>
        <div className="bg-surface-container-highest/60 backdrop-blur-3xl rounded-xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-outline-variant/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="mb-8">
            <h2 className="font-headline text-sm font-semibold text-primary uppercase tracking-widest mb-1">Secure Terminal Access</h2>
            <p className="text-on-surface-variant text-sm">Provide credentials to initialize neural link.</p>
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="block font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-medium" htmlFor="operatives_id">Operative ID</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-sm">badge</span>
                </span>
                <input className="block w-full pl-10 bg-surface-container-lowest border-transparent rounded-lg py-3 text-on-surface text-sm focus:bg-surface-container-low focus:border-secondary/20 focus:ring-0 transition-colors placeholder:text-outline/50" id="operatives_id" placeholder="Enter alphanumeric designation" type="text" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-medium" htmlFor="access_key">Access Key</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-sm">key</span>
                </span>
                <input className="block w-full pl-10 bg-surface-container-lowest border-transparent rounded-lg py-3 text-on-surface text-sm focus:bg-surface-container-low focus:border-secondary/20 focus:ring-0 transition-colors placeholder:text-outline/50" id="access_key" placeholder="••••••••••••••••" type="password" />
                <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors" type="button">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </button>
              </div>
            </div>
            <div className="pt-4">
              <button onClick={() => navigate('/app/dashboard')} className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed py-3.5 px-4 font-headline text-sm font-bold tracking-wide flex justify-center items-center gap-2 hover:opacity-90 transition-opacity" type="button">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>AUTHENTICATE</span>
                <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>arrow_right_alt</span>
              </button>
            </div>
          </form>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button className="font-label text-[10px] uppercase tracking-[0.1em] text-primary hover:text-secondary-container transition-colors bg-transparent">
              Request Protocol Bypass
            </button>
            <p className="text-[10px] text-outline">
              No account?{' '}
              <button onClick={() => navigate('/signup')} className="text-primary hover:text-secondary-container transition-colors">
                Request Access
              </button>
            </p>
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 w-full flex flex-col items-center gap-4 pb-8 bg-transparent">
        <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-medium font-['Inter']">
          <a className="text-gray-600 hover:text-[#c8bfff] transition-all" href="#">Privacy Protocol</a>
          <a className="text-gray-600 hover:text-[#c8bfff] transition-all" href="#">Terms of Intelligence</a>
          <a className="text-gray-600 hover:text-[#c8bfff] transition-all" href="#">System Status</a>
        </div>
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-medium font-['Inter']">© 2024 Obsidian Oracle AI. All rights reserved. Secure Terminal Access.</p>
      </footer>
    </div>
  );
};

export default LogInPage;
