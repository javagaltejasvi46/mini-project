import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';

const Layout = () => {
  return (
    <div className="bg-surface text-on-surface antialiased overflow-hidden selection:bg-primary-container selection:text-on-primary-container h-screen flex flex-col">
      <TopNavBar />
      <div className="flex h-screen pt-[72px]">
        <SideNavBar />
        <div className="flex-1 relative overflow-hidden flex">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
