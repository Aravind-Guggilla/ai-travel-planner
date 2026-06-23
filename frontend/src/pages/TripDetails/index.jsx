import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { toast } from '../../services/toast';
import DayCard from '../../components/DayCard';
import HotelCard from '../../components/HotelCard';
import BudgetCard from '../../components/BudgetCard';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { 
  Calendar, MapPin, DollarSign, Tag, Sparkles, 
  Trash2, Edit, ArrowLeft, AlertTriangle, MessageSquare,
  Utensils, Landmark, Compass as AdventureIcon, 
  ShoppingBag, Trees, Wine, Camera, Scroll
} from 'lucide-react';
import './index.css';

const INTERESTS_OPTIONS = [
  { id: 'Food', label: 'Food', icon: <Utensils size={14} /> },
  { id: 'Culture', label: 'Culture', icon: <Landmark size={14} /> },
  { id: 'Adventure', label: 'Adventure', icon: <AdventureIcon size={14} /> },
  { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={14} /> },
  { id: 'Nature', label: 'Nature', icon: <Trees size={14} /> },
  { id: 'Nightlife', label: 'Nightlife', icon: <Wine size={14} /> },
  { id: 'Photography', label: 'Photography', icon: <Camera size={14} /> },
  { id: 'History', label: 'History', icon: <Scroll size={14} /> },
];

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Modal triggers
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDestination, setEditDestination] = useState('');
  const [editDays, setEditDays] = useState(3);
  const [editBudgetType, setEditBudgetType] = useState('Medium');
  const [editInterests, setEditInterests] = useState([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Regenerate Day Modal
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [regenerateDayNum, setRegenerateDayNum] = useState(null);
  const [regenerateInstruction, setRegenerateInstruction] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Fetch trip details
  const fetchTripDetails = async () => {
    setIsLoading(true);
    try {
      // GET /api/trips/:tripId
      const response = await api.get(`/api/trips/${tripId}`);
      let tripData = response.data.tripDetails || response.data.trip || response.data.trips || response.data;
      if (Array.isArray(tripData)) {
        tripData = tripData[0];
      } else if (tripData && Array.isArray(tripData.trips)) {
        tripData = tripData.trips[0];
      }
      
      setTrip(tripData);
      
      // Prefill edit values
      if (tripData) {
        setEditDestination(tripData.destination || '');
        setEditDays(tripData.days || 3);
        setEditBudgetType(tripData.budget_type || tripData.budgetType || 'Medium');
        setEditInterests(tripData.interests || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trip details. It may have been deleted.');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  // Open edit modal directly if directed by URL query
  useEffect(() => {
    if (trip && location.search.includes('edit=true')) {
      setEditModalOpen(true);
    }
  }, [trip, location]);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate AI Plan
  const handleGenerateAIPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      // POST /api/trips/:tripId/generate
      const response = await api.post(`/api/trips/${tripId}/generate`);
      
      toast.success('AI Travel Plan generated successfully!');
      
      // The generate API returns { message: "...", travelPlan: { ... } }
      // We update local itinerary/hotels/budget immediately and fall back to detail fetch
      if (response.data?.travelPlan) {
        const { itinerary, estimatedBudget, hotels } = response.data.travelPlan;
        setTrip(prev => ({
          ...prev,
          itinerary,
          estimated_budget: estimatedBudget,
          hotels
        }));
      }
      
      // Full details sync to align any other server-derived properties
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to generate travel plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Delete Action
  const handleDeleteTrip = async () => {
    setIsDeleting(true);
    try {
      // DELETE /api/trips/delete/:tripId
      await api.delete(`/api/trips/delete/${tripId}`);
      toast.success('Trip deleted successfully!');
      navigate('/trips');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete trip.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  // Edit Action
  const handleInterestToggle = (interestId) => {
    if (editInterests.includes(interestId)) {
      setEditInterests(editInterests.filter((id) => id !== interestId));
    } else {
      setEditInterests([...editInterests, interestId]);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editDestination.trim()) return;
    setIsSavingEdit(true);

    try {
      // PUT /api/trips/update/:tripId
      const response = await api.put(`/api/trips/update/${tripId}`, {
        destination: editDestination.trim(),
        days: Number(editDays),
        budgetType: editBudgetType,
        interests: editInterests,
      });

      toast.success('Trip updated successfully!');
      let updatedTrip = response.data.tripDetails || response.data.trip || response.data.trips || response.data;
      if (Array.isArray(updatedTrip)) {
        updatedTrip = updatedTrip[0];
      } else if (updatedTrip && Array.isArray(updatedTrip.trips)) {
        updatedTrip = updatedTrip.trips[0];
      }
      setTrip(prev => ({ ...prev, ...updatedTrip }));
      setEditModalOpen(false);
      fetchTripDetails(); // Refresh fully
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update trip.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Regenerate Day Action
  const triggerRegenerateDay = (dayNum) => {
    setRegenerateDayNum(dayNum);
    setRegenerateInstruction('');
    setRegenerateModalOpen(true);
  };

  const handleRegenerateDaySubmit = async (e) => {
    e.preventDefault();
    if (!regenerateInstruction.trim()) {
      toast.error('Please enter instructions for the AI.');
      return;
    }

    setIsRegenerating(true);
    try {
      // POST /api/trips/:tripId/regenerate-day
      const response = await api.post(`/api/trips/${tripId}/regenerate-day`, {
        day: regenerateDayNum,
        instruction: regenerateInstruction.trim(),
      });

      toast.success(`Day ${regenerateDayNum} regenerated successfully!`);

      // Update itinerary list instantly with no refresh
      // The API returns the updated itinerary or whole travel plan. Let's merge it:
      const returnedData = response.data;
      
      let newItinerary = [];
      if (Array.isArray(returnedData)) {
        newItinerary = returnedData;
      } else if (returnedData.itinerary && Array.isArray(returnedData.itinerary)) {
        newItinerary = returnedData.itinerary;
      } else if (returnedData.travelPlan?.itinerary && Array.isArray(returnedData.travelPlan.itinerary)) {
        newItinerary = returnedData.travelPlan.itinerary;
      } else {
        // Fallback query if formatting doesn't match standard
        fetchTripDetails();
        setRegenerateModalOpen(false);
        return;
      }

      setTrip(prev => ({
        ...prev,
        travelPlan: {
          ...prev.travelPlan,
          itinerary: newItinerary
        }
      }));

      setRegenerateModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to regenerate day. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return <Loader type="skeleton" variant="detail" />;
  }

  if (!trip) {
    return (
      <div className="trip-not-found">
        <AlertTriangle size={48} className="warning-icon" />
        <h2>Trip Plan Not Found</h2>
        <p>This trip may have been deleted or the link is incorrect.</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  // Extract travel plan details safely
  const travelPlan = trip.travelPlan || null;
  
  // Support both inline properties (from Postgres/MERN) and nested travelPlan structure
  const itinerary = trip.itinerary || travelPlan?.itinerary || [];
  const estimatedBudget = trip.estimated_budget || trip.estimatedBudget || travelPlan?.estimatedBudget || travelPlan?.estimated_budget || null;
  const hotels = trip.hotels || travelPlan?.hotels || [];
  
  const hasPlan = itinerary.length > 0 || hotels.length > 0 || estimatedBudget !== null;

  return (
    <div className="trip-detail-page-container">
      {/* Back & Actions Header */}
      <div className="trip-detail-nav-row">
        <button className="back-btn" onClick={() => navigate('/trips')}>
          <ArrowLeft size={16} />
          <span>All Trips</span>
        </button>

        <div className="trip-detail-actions">
          <button className="detail-action-btn edit" onClick={() => setEditModalOpen(true)}>
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button className="detail-action-btn delete" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Info Hero Box */}
      <div className="trip-detail-hero glass-panel">
        <div className="hero-left">
          <div className="hero-dest-row">
            <MapPin size={22} className="hero-pin-icon" />
            <h1 className="hero-dest-name">{trip.destination}</h1>
          </div>
          <p className="hero-created-date">Journey starts: {formatDate(trip.created_at || trip.createdAt)}</p>

          <div className="hero-badges-row">
            <span className="hero-badge days">
              <Calendar size={13} />
              {trip.days} {trip.days === 1 ? 'Day' : 'Days'}
            </span>
            <span className={`hero-badge budget ${(trip.budget_type || trip.budgetType)?.toLowerCase()}`}>
              <DollarSign size={13} />
              {trip.budget_type || trip.budgetType} Budget
            </span>
          </div>
        </div>

        {trip.interests && trip.interests.length > 0 && (
          <div className="hero-right">
            <span className="hero-right-label">Interests & Preferences</span>
            <div className="hero-interests-list">
              {trip.interests.map((interest, idx) => (
                <span key={idx} className="hero-interest-badge">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generating State Overlay */}
      {isGeneratingPlan && (
        <div className="generating-ai-plan-loading">
          <Loader type="spinner" message="Generating your travel plan..." />
        </div>
      )}

      {/* Content Render: If Travel Plan exists vs Empty State */}
      {!isGeneratingPlan && (
        hasPlan ? (
          <div className="travel-plan-results-layout">
            
            {/* Left Column: Itinerary Timeline */}
            <div className="results-main-col">
              <h2 className="section-block-title">Your AI Itinerary</h2>
              
              <div className="itinerary-list">
                {itinerary.map((dayData, idx) => (
                  <DayCard
                    key={idx}
                    dayNumber={dayData.day}
                    activities={dayData.activities}
                    onRegenerate={triggerRegenerateDay}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Hotels & Budget */}
            <div className="results-side-col">
              {/* Estimated Budget Card */}
              {estimatedBudget && (
                <div className="side-block">
                  <h2 className="section-block-title">Budget Allocation</h2>
                  <BudgetCard estimatedBudget={estimatedBudget} />
                </div>
              )}

              {/* Recommended Hotels */}
              {hotels && hotels.length > 0 && (
                <div className="side-block">
                  <h2 className="section-block-title">Hotel Recommendations</h2>
                  <div className="hotels-stack">
                    {hotels.map((hotel, idx) => (
                      <HotelCard key={idx} hotel={hotel} />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Empty State: AI plan not generated yet */
          <div className="empty-travel-plan-state glass-panel">
            <Sparkles size={64} className="empty-spark-icon animate-pulse" />
            <h2 className="empty-title">Generate AI Travel Plan</h2>
            <p className="empty-desc">
              Your customized preferences are ready. Let our AI build a complete itinerary, recommended hotels, and budget forecasts for your {trip.days}-day stay.
            </p>
            <button className="generate-plan-btn" onClick={handleGenerateAIPlan}>
              <Sparkles size={16} />
              <span>Generate AI Plan</span>
            </button>
          </div>
        )
      )}

      {/* Edit Trip Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => !isSavingEdit && setEditModalOpen(false)}
        title="Edit Trip Parameters"
      >
        <form className="modal-form" onSubmit={handleSaveEdit}>
          <div className="input-group">
            <label className="input-label">DESTINATION</label>
            <input
              type="text"
              className="form-input"
              value={editDestination}
              onChange={(e) => setEditDestination(e.target.value)}
              disabled={isSavingEdit}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">NUMBER OF DAYS</label>
            <input
              type="number"
              min="1"
              max="30"
              className="form-input"
              value={editDays}
              onChange={(e) => setEditDays(e.target.value)}
              disabled={isSavingEdit}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">BUDGET TYPE</label>
            <select
              className="form-input"
              value={editBudgetType}
              onChange={(e) => setEditBudgetType(e.target.value)}
              disabled={isSavingEdit}
            >
              <option value="Budget">Budget</option>
              <option value="Medium">Medium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">INTERESTS</label>
            <div className="edit-interests-badges">
              {INTERESTS_OPTIONS.map((opt) => {
                const isSelected = editInterests.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    className={`edit-interest-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => handleInterestToggle(opt.id)}
                    disabled={isSavingEdit}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="modal-form-actions">
            <button
              type="button"
              className="modal-btn cancel"
              disabled={isSavingEdit}
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn confirm"
              disabled={isSavingEdit}
            >
              {isSavingEdit ? 'Saving...' : 'Save & Replan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete Trip Plan"
      >
        <div className="delete-modal-body">
          <p>Are you sure you want to delete this trip to <strong>{trip.destination}</strong>?</p>
          <p className="delete-warning-text">This action is permanent and deletes all generated travel plans, itinerary items, and recommendations.</p>
          <div className="modal-form-actions">
            <button
              className="modal-btn cancel"
              disabled={isDeleting}
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="modal-btn danger"
              disabled={isDeleting}
              onClick={handleDeleteTrip}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Regenerate Day Instructions Modal */}
      <Modal
        isOpen={regenerateModalOpen}
        onClose={() => !isRegenerating && setRegenerateModalOpen(false)}
        title={`Regenerate Day ${regenerateDayNum} Plan`}
      >
        <form className="modal-form" onSubmit={handleRegenerateDaySubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="instruction-input">
              Provide instructions to customize this day's plan
            </label>
            <textarea
              id="instruction-input"
              className="form-input text-area-input"
              rows="4"
              placeholder="e.g. More outdoor activities, focus on local street food, or add shopping recommendations."
              value={regenerateInstruction}
              onChange={(e) => setRegenerateInstruction(e.target.value)}
              disabled={isRegenerating}
              required
            />
          </div>

          <div className="modal-form-actions">
            <button
              type="button"
              className="modal-btn cancel"
              disabled={isRegenerating}
              onClick={() => setRegenerateModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn confirm"
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Sparkles size={14} className="animate-spin" />
                  <span>Regenerating...</span>
                </>
              ) : (
                <span>Regenerate Day</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TripDetails;
