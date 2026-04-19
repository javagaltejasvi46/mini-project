import React from 'react';
import { NavLink } from 'react-router-dom';

const SideNavBar = () => {
  const getNavClasses = ({ isActive }) => 
    isActive 
      ? "flex items-center gap-3 px-4 py-3 rounded-r-full bg-gradient-to-r from-[#c8bfff]/10 to-transparent text-[#c8bfff] font-semibold border-l-4 border-[#c8bfff] ease-out duration-200"
      : "flex items-center gap-3 px-4 py-3 rounded-r-full text-gray-500 hover:text-gray-200 hover:bg-[#1c1b1c] transition-all ease-out duration-200 border-l-4 border-transparent";

  return (
    <aside className="hidden md:flex flex-col h-full w-64 border-r border-[#474557]/15 bg-gradient-to-b from-[#131314] to-[#1c1b1c] shadow-[40px_0_80px_rgba(0,0,0,0.2)] py-8 font-['Inter'] text-[13px] leading-relaxed relative z-40">
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-bold tracking-tighter text-white">SANJAYA</h2>
        <p className="text-primary text-xs uppercase tracking-[0.1em] mt-1 opacity-70">v4.0 Oracle</p>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-4">
        <NavLink to="/dashboard" className={getNavClasses}>
          <span className="material-symbols-outlined text-[18px]">insights</span>
          Oracle Dashboard
        </NavLink>
        <NavLink to="/flow-optimizer" className={getNavClasses}>
          <span className="material-symbols-outlined text-[18px]">traffic</span>
          Neural Flow Optimizer
        </NavLink>
        <NavLink to="/predictive-hub" className={getNavClasses}>
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          Predictive Hub
        </NavLink>
        <NavLink to="/health" className={getNavClasses}>
          <span className="material-symbols-outlined text-[18px]">dns</span>
          System Health
        </NavLink>
      </nav>
      <div className="px-6 mt-auto">
        <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-medium py-3 rounded-xl mb-6 hover:opacity-90 transition-opacity">
          Initiate Scan
        </button>
        <div className="flex flex-col gap-2">
          <a className="flex items-center gap-2 text-gray-500 hover:text-gray-200 text-xs transition-colors" href="#">
            <span className="material-symbols-outlined text-[14px]">menu_book</span> Documentation
          </a>
          <a className="flex items-center gap-2 text-gray-500 hover:text-gray-200 text-xs transition-colors" href="#">
            <span className="material-symbols-outlined text-[14px]">help</span> Support
          </a>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;
