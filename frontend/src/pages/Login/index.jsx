import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCookie, getCookie, decodeToken } from '../../services/cookies';
import api from '../../services/api';
import { toast } from '../../services/toast';
import { Compass } from 'lucide-react';
import './index.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (getCookie('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      // POST /api/auth/login
      const response = await api.post('/api/auth/login', { email, password });
      const { token } = response.data;

      if (!token) {
        throw new Error('No token returned from server');
      }

      // Store JWT token in cookies
      setCookie('token', token, 7);

      // Decode JWT to extract name and details
      const decoded = decodeToken(token) || {};
      const userData = {
        email,
        name: decoded.name || decoded.email?.split('@')[0] || 'Traveler',
        id: decoded.id || decoded.sub || null,
      };
      
      // Store user details in cookies
      setCookie('user', JSON.stringify(userData), 7);

      // Trigger standard event to refresh navbar and routing state
      window.dispatchEvent(new Event('auth-change'));
      
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Left Panel */}
      <div className="brand-panel">
        <div className="brand-content">
          <h1 className="brand-heading">
            AI Travel Planner{' '}
            <Compass size={32} className="brand-icon-spin" />
          </h1>

          <p className="brand-tagline">
            Plan your dream itineraries in seconds,
            <br />
            crafted for the modern traveler.
          </p>

          <ul className="brand-features">
            <li>Hyper-personalized AI-generated itineraries</li>
            <li>Curated hotel recommendations</li>
            <li>Visual budget breakdowns & cost calculations</li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="form-panel">
        <div className="form-content">
          <h2 className="form-heading">Welcome back</h2>

          <p className="form-subheading">Sign in to your AI Travel Planner account</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Error Box */}
            {error && (
              <div className="error-box">
                <span className="error-text">{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="input-group">
              <label htmlFor="email-input" className="input-label">
                EMAIL ADDRESS
              </label>

              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="password-label-row">
                <label htmlFor="password-input" className="input-label">
                  PASSWORD
                </label>

                <button type="button" className="forgot-password-link" tabIndex="-1">
                  Forgot password?
                </button>
              </div>

              <input
                id="password-input"
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Sign Up Redirect */}
            <p className="signup-prompt">
              Don't have an account?{' '}
              <Link to="/register" className="signup-link">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
