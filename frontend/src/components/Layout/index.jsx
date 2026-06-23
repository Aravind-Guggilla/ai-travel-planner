import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import './index.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout-root">
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="app-layout-body">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="app-layout-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
