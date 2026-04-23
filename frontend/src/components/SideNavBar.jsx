import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { api } from '../api';

const NAV_ITEMS = [
  { to: '/app/dashboard',      icon: 'insights',    label: 'Oracle Dashboard' },
  { to: '/app/flow-optimizer', icon: 'traffic',     label: 'Neural Flow Optimizer' },
  { to: '/app/predictive-hub', icon: 'psychology',  label: 'Predictive Hub' },
  { to: '/app/health',         icon: 'dns',         label: 'System Health' },
];

const SideNavBar = () => {
  const location = useLocation();
  const [scanning, setScanning]     = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Refs for each nav item to measure position
  const itemRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 });

  // Active index
  const activeIndex = NAV_ITEMS.findIndex(item =>
    location.pathname === item.to ||
    (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
  );

  // Move the sliding indicator to the active item
  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    const { offsetTop, offsetHeight } = el;
    setIndicatorStyle({ top: offsetTop, height: offsetHeight, opacity: 1 });
  }, [activeIndex]);

  const handleInitiateScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await api.fetchLiveData();
      setScanResult(res.status === 'success' ? 'success' : 'error');
    } catch {
      setScanResult('error');
    } finally {
      setScanning(false);
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-64 border-r border-[#474557]/15 bg-gradient-to-b from-[#131314] to-[#1c1b1c] shadow-[40px_0_80px_rgba(0,0,0,0.2)] py-8 font-['Inter'] text-[13px] leading-relaxed relative z-40">
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-bold tracking-tighter text-white">SANJAYA</h2>
        <p className="text-primary text-xs uppercase tracking-[0.1em] mt-1 opacity-70">v4.0 Oracle</p>
      </div>

      {/* Nav with sliding indicator */}
      <nav className="flex-1 flex flex-col gap-1 px-4 relative">

        {/* Sliding background pill — absolutely positioned, transitions smoothly */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 rounded-r-full pointer-events-none"
          style={{
            top: indicatorStyle.top,
            height: indicatorStyle.height,
            opacity: indicatorStyle.opacity,
            background: 'linear-gradient(90deg, rgba(200,191,255,0.10) 0%, transparent 100%)',
            borderLeft: '3px solid #c8bfff',
            transition: 'top 0.32s cubic-bezier(0.16,1,0.3,1), height 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease',
          }}
        />

        {NAV_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              ref={el => { itemRefs.current[i] = el; }}
              className="flex items-center gap-3 px-4 py-3 rounded-r-full relative z-10 border-l-[3px] border-transparent"
              style={{
                color: isActive ? '#c8bfff' : '#6b7280',
                fontWeight: isActive ? 600 : 400,
                transition: 'color 0.25s cubic-bezier(0.16,1,0.3,1), font-weight 0.25s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#e5e2e3'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}
              >
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <button
          onClick={handleInitiateScan}
          disabled={scanning}
          className={`w-full font-medium py-3 rounded-xl mb-2 transition-all flex items-center justify-center gap-2 text-sm ${
            scanResult === 'success'
              ? 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30'
              : scanResult === 'error'
              ? 'bg-error/20 text-error border border-error/30'
              : 'bg-gradient-to-br from-primary to-primary-container text-white hover:opacity-90'
          } disabled:opacity-60`}
        >
          <span className={`material-symbols-outlined text-[16px] ${scanning ? 'animate-spin' : ''}`}>
            {scanning ? 'progress_activity' : scanResult === 'success' ? 'check_circle' : scanResult === 'error' ? 'error' : 'radar'}
          </span>
          {scanning ? 'Scanning...' : scanResult === 'success' ? 'Scan Complete' : scanResult === 'error' ? 'Scan Failed' : 'Initiate Scan'}
        </button>
        <p className="text-[10px] text-outline text-center mb-4">Fetches live traffic data for all monitoring locations</p>

        <div className="flex flex-col gap-2">
          <a className="flex items-center gap-2 text-gray-500 hover:text-gray-200 text-xs transition-colors" href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
            <span className="material-symbols-outlined text-[14px]">menu_book</span> API Documentation
          </a>
          <a className="flex items-center gap-2 text-gray-500 hover:text-gray-200 text-xs transition-colors" href="https://github.com/javagaltejasvi46/mini-project" target="_blank" rel="noreferrer">
            <span className="material-symbols-outlined text-[14px]">code</span> Source Code
          </a>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;
