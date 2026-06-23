import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCookie } from './services/cookies';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';

// Route Guards & Layouts
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';

// Toast Icon
import { X } from 'lucide-react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie('token'));
  const [toasts, setToasts] = useState([]);

  // Reactively monitor authentication cookie changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!getCookie('token'));
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('auth-clear', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('auth-clear', handleAuthChange);
    };
  }, []);

  // Listen for global custom toast notifications
  useEffect(() => {
    const handleToastEvent = (e) => {
      const { type, message } = e.detail || {};
      const id = Date.now() + Math.random();
      
      setToasts((prev) => [...prev, { id, type, message }]);

      // Automatically dismiss the toast after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    };

    window.addEventListener('app-toast', handleToastEvent);
    return () => {
      window.removeEventListener('app-toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type || 'success'}`}>
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/* Main Layout Shell */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/trips/:tripId" element={<TripDetails />} />
            {/* Redirect / to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
