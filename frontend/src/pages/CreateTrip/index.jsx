import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from '../../services/toast';
import { 
  Compass, Wallet, Briefcase, Gem, 
  Utensils, Landmark, Compass as AdventureIcon, 
  ShoppingBag, Trees, Wine, Camera, Scroll 
} from 'lucide-react';
import './index.css';

const INTERESTS_OPTIONS = [
  { id: 'Food', label: 'Food & Dining', icon: <Utensils size={18} /> },
  { id: 'Culture', label: 'Art & Culture', icon: <Landmark size={18} /> },
  { id: 'Adventure', label: 'Adventure Sports', icon: <AdventureIcon size={18} /> },
  { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={18} /> },
  { id: 'Nature', label: 'Nature & Parks', icon: <Trees size={18} /> },
  { id: 'Nightlife', label: 'Nightlife', icon: <Wine size={18} /> },
  { id: 'Photography', label: 'Photography', icon: <Camera size={18} /> },
  { id: 'History', label: 'History & Landmarks', icon: <Scroll size={18} /> },
];

const BUDGET_OPTIONS = [
  { id: 'Budget', label: 'Budget', desc: 'Cheapest stays & local eats', icon: <Wallet size={24} /> },
  { id: 'Medium', label: 'Medium', desc: 'Mid-range comfort & tours', icon: <Briefcase size={24} /> },
  { id: 'Luxury', label: 'Luxury', desc: 'Fine dining & premium hotels', icon: <Gem size={24} /> },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budgetType, setBudgetType] = useState('Medium');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleInterestToggle = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Form Validations
    if (!destination.trim()) {
      setValidationError('Please enter a destination.');
      toast.error('Destination is required.');
      return;
    }
    if (!days || days < 1 || days > 30) {
      setValidationError('Number of days must be between 1 and 30.');
      toast.error('Invalid number of days.');
      return;
    }
    if (selectedInterests.length === 0) {
      setValidationError('Please select at least one interest.');
      toast.error('Select at least one interest.');
      return;
    }

    setIsLoading(true);

    try {
      // POST /api/trips/create
      const response = await api.post('/api/trips/create', {
        destination: destination.trim(),
        days: Number(days),
        budgetType,
        interests: selectedInterests,
      });

      const newTrip = response.data;
      const tripId = newTrip._id || newTrip.trip?._id || newTrip.tripId;

      toast.success('AI Trip created successfully!');
      
      if (tripId) {
        navigate(`/trips/${tripId}`);
      } else {
        // Fallback to trips listing if id is missing in response
        navigate('/trips');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to create trip. Please try again.';
      setValidationError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-header">
        <h1 className="create-trip-title">Plan a New Adventure ✈️</h1>
        <p className="create-trip-subtitle">
          Provide your preferences and let our AI model build a customized travel itinerary for you.
        </p>
      </div>

      <form className="create-trip-form-card" onSubmit={handleSubmit}>
        {validationError && (
          <div className="form-error-banner">
            <span>{validationError}</span>
          </div>
        )}

        {/* Destination */}
        <div className="form-section">
          <label className="section-label" htmlFor="destination-input">
            What is your destination of choice?
          </label>
          <input
            id="destination-input"
            type="text"
            className="text-input"
            placeholder="e.g. Tokyo, Paris, Bali"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Days */}
        <div className="form-section">
          <label className="section-label" htmlFor="days-input">
            How many days is your trip?
          </label>
          <input
            id="days-input"
            type="number"
            min="1"
            max="30"
            className="text-input days-input-field"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Budget Options */}
        <div className="form-section">
          <label className="section-label">What is your planned budget?</label>
          <div className="budget-selection-grid">
            {BUDGET_OPTIONS.map((opt) => {
              const isSelected = budgetType === opt.id;
              return (
                <div
                  key={opt.id}
                  className={`budget-select-card ${isSelected ? 'active' : ''}`}
                  onClick={() => !isLoading && setBudgetType(opt.id)}
                >
                  <div className={`budget-icon-wrapper ${opt.id.toLowerCase()}`}>
                    {opt.icon}
                  </div>
                  <h3 className="budget-card-title">{opt.label}</h3>
                  <p className="budget-card-desc">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interests Section */}
        <div className="form-section">
          <label className="section-label">Select your travel interests</label>
          <div className="interests-selection-grid">
            {INTERESTS_OPTIONS.map((opt) => {
              const isSelected = selectedInterests.includes(opt.id);
              return (
                <button
                  type="button"
                  key={opt.id}
                  className={`interest-select-badge ${isSelected ? 'active' : ''}`}
                  onClick={() => !isLoading && handleInterestToggle(opt.id)}
                >
                  <span className="interest-select-icon">{opt.icon}</span>
                  <span className="interest-select-label">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="form-actions-row">
          <button
            type="button"
            className="form-cancel-btn"
            onClick={() => navigate('/dashboard')}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="form-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Compass size={18} className="spinner-plane" />
                <span>Crafting Itinerary...</span>
              </>
            ) : (
              <span>Generate AI Trip Plan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
