import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCookie } from '../../services/cookies';
import api from '../../services/api';
import { toast } from '../../services/toast';
import TripCard from '../../components/TripCard';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Plus, Compass, Calendar, AlertCircle } from 'lucide-react';
import './index.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Traveler');
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch username from cookies
  useEffect(() => {
    const savedUserStr = getCookie('user');
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser.name) {
          setUserName(savedUser.name);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch user trips
  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      // GET /api/my-trips
      const response = await api.get('/api/my-trips');
      // Verify data is an array
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

  // Handle Edit Action from Trip Card
  const handleEditTrip = (trip) => {
    const id = trip._id || trip.id;
    navigate(`/trips/${id}?edit=true`);
  };

  // Handle Delete Action from Trip Card
  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTrip = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    const id = tripToDelete._id || tripToDelete.id;
    try {
      // DELETE /api/trips/delete/:tripId
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

  // Sort trips by created date to get recent ones
  const sortedTrips = [...trips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentTrips = sortedTrips.slice(0, 3);

  return (
    <div className="dashboard-page-container">
      {/* Welcome Banner */}
      <div className="welcome-banner glass-panel">
        <div className="welcome-content">
          <h1 className="welcome-heading">Hello, {userName}! 👋</h1>
          <p className="welcome-tagline">
            Where would you like to explore next? Let AI craft your perfect itinerary.
          </p>
        </div>
        <button className="dashboard-cta-btn" onClick={() => navigate('/create-trip')}>
          <Plus size={18} />
          <span>Plan a New Trip</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Compass size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total AI Trips</span>
            <span className="stat-value">{isLoading ? '...' : trips.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper teal">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Planned Days</span>
            <span className="stat-value">
              {isLoading ? '...' : trips.reduce((acc, t) => acc + (Number(t.days) || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div className="recent-trips-section">
        <div className="section-header">
          <h2 className="section-title">Recent Trips</h2>
          {trips.length > 3 && (
            <Link to="/trips" className="view-all-link">
              View All Trips &rarr;
            </Link>
          )}
        </div>

        {isLoading ? (
          <Loader type="skeleton" variant="card" count={3} />
        ) : recentTrips.length > 0 ? (
          <div className="trips-grid">
            {recentTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onEdit={handleEditTrip}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="empty-dashboard-state card-empty">
            <AlertCircle size={48} className="empty-icon" />
            <h3 className="empty-title">No trips created yet</h3>
            <p className="empty-desc">Let AI plan your next adventure! Choose your destination, interests, and budget.</p>
            <button className="empty-cta-btn" onClick={() => navigate('/create-trip')}>
              Create Your First AI Trip
            </button>
          </div>
        )}
      </div>

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
              onClick={confirmDeleteTrip}
            >
              {isDeleting ? 'Deleting...' : 'Delete Trip'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
