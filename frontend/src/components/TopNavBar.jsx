import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNavBar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131314]/60 backdrop-blur-[24px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-8">
        <div className="text-lg font-black tracking-[-0.02em] text-[#c8bfff] uppercase">
          SANJAYA INSIGHT ENGINE
        </div>
        <div className="hidden md:flex gap-6 font-['Inter'] tracking-tight text-sm font-medium">
          <NavLink to="/health" className={({isActive}) => isActive ? "text-[#c8bfff] hover:bg-[#353436]/50 transition-all duration-300 px-3 py-1.5 rounded-lg border-b-2 border-[#c8bfff]" : "text-[#a1a1aa] hover:text-[#c8bfff] hover:bg-[#353436]/50 transition-all duration-300 px-3 py-1.5 rounded-lg"}>Network Status</NavLink>
          <NavLink to="/flow-optimizer" className={({isActive}) => isActive ? "text-[#c8bfff] hover:bg-[#353436]/50 transition-all duration-300 px-3 py-1.5 rounded-lg border-b-2 border-[#c8bfff]" : "text-[#a1a1aa] hover:text-[#c8bfff] hover:bg-[#353436]/50 transition-all duration-300 px-3 py-1.5 rounded-lg"}>Flow Analysis</NavLink>
          <NavLink to="/predictive-hub" className={({isActive}) => isActive ? "text-[#c8bfff] hover:bg-[#353436]/50 transition-all duration-300 px-3 py-1.5 rounded-lg border-b-2 border-[#c8bfff]" : "text-[#a1a1aa] hover:text-[#c8bfff] hover:bg-[#353436]/50 transition-all duration-300 px-3 py-1.5 rounded-lg"}>Predictive Hub</NavLink>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input 
            className="bg-surface-container-lowest border-none outline-none text-sm text-on-surface focus:ring-0 focus:bg-surface-container-low transition-colors pl-9 pr-4 py-2 w-64 rounded-full border border-transparent focus:border-outline-variant/20 placeholder:text-outline/50" 
            placeholder="Neural Search Coordinates..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-4 text-primary">
          <button className="scale-[0.98] active:opacity-80 transition-transform hover:bg-[#353436]/50 p-2 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="scale-[0.98] active:opacity-80 transition-transform hover:bg-[#353436]/50 p-2 rounded-full">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="scale-[0.98] active:opacity-80 transition-transform hover:bg-[#353436]/50 p-2 rounded-full">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
