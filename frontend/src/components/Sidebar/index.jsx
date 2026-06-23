import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, PlusCircle, Compass } from 'lucide-react';
import './index.css';

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/trips', label: 'My Trips', icon: <Map size={20} /> },
    { path: '/create-trip', label: 'Plan a Trip', icon: <PlusCircle size={20} /> },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-container glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-links-wrapper">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span className="sidebar-link-label">{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-card">
            <Compass size={32} className="sidebar-card-icon" />
            <h4 className="sidebar-card-title">Explore More</h4>
            <p className="sidebar-card-desc">Plan premium itineraries powered by AI.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
