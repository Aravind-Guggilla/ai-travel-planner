import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCookie, deleteCookie } from '../../services/cookies';
import { toast } from '../../services/toast';
import { Compass, LogOut, MapPin, Menu } from 'lucide-react';
import './index.css';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Sync token and user profile details from cookies on mount or route changes
  const syncAuth = () => {
    const activeToken = getCookie('token');
    const activeUserStr = getCookie('user');
    
    setToken(activeToken);
    if (activeUserStr) {
      try {
        setUser(JSON.parse(activeUserStr));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuth();

    // Listen for cookie auth changes or auth-clears to update UI
    const handleAuthEvent = () => {
      syncAuth();
    };

    window.addEventListener('auth-change', handleAuthEvent);
    window.addEventListener('auth-clear', handleAuthEvent);

    return () => {
      window.removeEventListener('auth-change', handleAuthEvent);
      window.removeEventListener('auth-clear', handleAuthEvent);
    };
  }, []);

  const handleLogout = () => {
    deleteCookie('token');
    deleteCookie('user');
    
    // Trigger auth change event so routing updates
    window.dispatchEvent(new Event('auth-clear'));
    
    toast.success('Signed out successfully.');
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <nav className="navbar-container glass-panel">
      <div className="navbar-left">
        {isAuthenticated && (
          <button className="sidebar-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
        )}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo-icon">
            <Compass size={24} className="spin-slow" />
          </span>
          <span className="brand-name">AI Travel Planner</span>
        </Link>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="user-menu-wrapper">
            <button 
              className="user-profile-trigger" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            >
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-display-name">{user?.name || 'Traveler'}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user?.name || 'Traveler'}</p>
                  <p className="dropdown-user-email">{user?.email || ''}</p>
                </div>
                <div className="dropdown-divider" />
                <Link to="/dashboard" className="dropdown-item">
                  <MapPin size={16} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-links">
            {location.pathname !== '/login' && (
              <Link to="/login" className="nav-btn-link login">Sign In</Link>
            )}
            {location.pathname !== '/register' && (
              <Link to="/register" className="nav-btn-link register">Get Started</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
