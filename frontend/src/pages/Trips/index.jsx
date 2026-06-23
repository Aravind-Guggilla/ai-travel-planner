import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from '../../services/toast';
import TripCard from '../../components/TripCard';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { 
  Plus, Compass, AlertCircle, 
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

const Trips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState(null);
  const [editDestination, setEditDestination] = useState('');
  const [editDays, setEditDays] = useState(3);
  const [editBudgetType, setEditBudgetType] = useState('Medium');
  const [editInterests, setEditInterests] = useState([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Fetch all user trips
  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/my-trips');
      if (Array.isArray(response.data)) {
        setTrips(response.data);
      } else if (response.data && Array.isArray(response.data.trips)) {
        setTrips(response.data.trips);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trips. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Delete Action Flow
  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    const id = tripToDelete._id || tripToDelete.id;
    try {
      await api.delete(`/api/trips/delete/${id}`);
      toast.success('Trip deleted successfully!');
      setTrips(trips.filter((t) => (t._id || t.id) !== id));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete trip. Please try again.');
    } finally {
      setIsDeleting(false);
      setTripToDelete(null);
    }
  };

  // Edit Action Flow
  const handleEditClick = (trip) => {
    setTripToEdit(trip);
    setEditDestination(trip.destination);
    setEditDays(trip.days);
    setEditBudgetType(trip.budget_type || trip.budgetType || 'Medium');
    setEditInterests(trip.interests || []);
    setEditModalOpen(true);
  };

  const handleInterestToggle = (interestId) => {
    if (editInterests.includes(interestId)) {
      setEditInterests(editInterests.filter((id) => id !== interestId));
    } else {
      setEditInterests([...editInterests, interestId]);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editDestination.trim()) {
      toast.error('Destination cannot be empty.');
      return;
    }
    if (!editDays || editDays < 1 || editDays > 30) {
      toast.error('Days must be between 1 and 30.');
      return;
    }
    if (editInterests.length === 0) {
      toast.error('Select at least one interest.');
      return;
    }

    setIsSavingEdit(true);
    const id = tripToEdit._id || tripToEdit.id;
    try {
      const response = await api.put(`/api/trips/update/${id}`, {
        destination: editDestination.trim(),
        days: Number(editDays),
        budgetType: editBudgetType,
        interests: editInterests,
      });

      toast.success('Trip details updated successfully!');
      
      // Update local state in trips array
      const updatedTrip = response.data.trip || response.data;
      setTrips(
        trips.map((t) => ((t._id || t.id) === id ? { ...t, ...updatedTrip } : t))
      );
      
      setEditModalOpen(false);
      // Optional reload to refresh if nested data structure changed
      fetchTrips();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update trip.');
    } finally {
      setIsSavingEdit(false);
      setTripToEdit(null);
    }
  };

  return (
    <div className="trips-page-container">
      <div className="trips-page-header">
        <div className="header-info">
          <h1 className="trips-title">My Travel Plans 🗺️</h1>
          <p className="trips-subtitle">
            Manage your saved journeys, generated itineraries, and upcoming plans.
          </p>
        </div>
        <button className="plan-trip-btn" onClick={() => navigate('/create-trip')}>
          <Plus size={16} />
          <span>Plan a New Trip</span>
        </button>
      </div>

      {isLoading ? (
        <Loader type="skeleton" variant="card" count={6} />
      ) : trips.length > 0 ? (
        <div className="trips-grid">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="empty-trips-state card-empty">
          <AlertCircle size={48} className="empty-icon" />
          <h3 className="empty-title">No trips created yet</h3>
          <p className="empty-desc">You haven't generated any AI travel plans. Create your first journey now.</p>
          <button className="empty-cta-btn" onClick={() => navigate('/create-trip')}>
            Plan Your First AI Trip
          </button>
        </div>
      )}

      {/* Edit Trip Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => !isSavingEdit && setEditModalOpen(false)}
        title="Edit Trip Details"
      >
        <form className="modal-form" onSubmit={saveEdit}>
          {/* Destination */}
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

          {/* Days */}
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

          {/* Budget Type */}
          <div className="input-group">
            <label className="input-label">BUDGET LEVEL</label>
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

          {/* Interests */}
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

          {/* Actions */}
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
              {isSavingEdit ? 'Saving...' : 'Save Changes'}
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
          <p>Are you sure you want to delete your trip to <strong>{tripToDelete?.destination}</strong>?</p>
          <p className="delete-warning-text">This action cannot be undone and your AI itinerary will be lost.</p>
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
              onClick={confirmDelete}
            >
              {isDeleting ? 'Deleting...' : 'Delete Trip'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trips;
