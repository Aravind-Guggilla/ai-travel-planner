import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCookie } from '../../services/cookies';
import api from '../../services/api';
import { toast } from '../../services/toast';
import { Compass } from 'lucide-react';
import './index.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
    if (!name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // POST /api/auth/register
      await api.post('/api/auth/register', { name, email, password });
      
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Try again.';
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
          <h2 className="form-heading">Create Account</h2>

          <p className="form-subheading">Get started with AI Travel Planner today</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Error Box */}
            {error && (
              <div className="error-box">
                <span className="error-text">{error}</span>
              </div>
            )}

            {/* Name */}
            <div className="input-group">
              <label htmlFor="name-input" className="input-label">
                FULL NAME
              </label>

              <input
                id="name-input"
                type="text"
                className="form-input"
                placeholder="Aravind"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

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
              <label htmlFor="password-input" className="input-label">
                PASSWORD
              </label>

              <input
                id="password-input"
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Login Redirect */}
            <p className="signup-prompt">
              Already have an account?{' '}
              <Link to="/login" className="signup-link">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
