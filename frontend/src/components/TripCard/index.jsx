import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Tag, Trash2, Edit, Eye } from 'lucide-react';
import './index.css';

const TripCard = ({ trip, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { destination, days, interests } = trip;
  const tripId = trip._id || trip.id;
  const budgetType = trip.budget_type || trip.budgetType || '';
  const createdAt = trip.created_at || trip.createdAt;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Determine gradient header based on budget type
  const getBudgetGradientClass = () => {
    switch (budgetType?.toLowerCase()) {
      case 'budget':
        return 'gradient-budget';
      case 'luxury':
      case 'high':
        return 'gradient-luxury';
      case 'medium':
      default:
        return 'gradient-medium';
    }
  };

  return (
    <div className="trip-card-container">
      {/* Visual Header */}
      <div className={`trip-card-header ${getBudgetGradientClass()}`}>
        <div className="destination-badge">
          <MapPin size={14} />
          <span>{destination}</span>
        </div>
        <div className="days-badge">
          <span>{days} {days === 1 ? 'Day' : 'Days'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="trip-card-body">
        <h3 className="trip-card-destination">{destination}</h3>
        <p className="trip-card-date">Created on {formatDate(createdAt)}</p>

        <div className="trip-info-row">
          <span className="trip-info-label">
            <DollarSign size={14} />
            Budget Type:
          </span>
          <span className={`trip-info-value budget-badge ${budgetType?.toLowerCase()}`}>
            {budgetType}
          </span>
        </div>

        {interests && interests.length > 0 && (
          <div className="trip-interests-wrapper">
            <span className="trip-info-label">
              <Tag size={14} />
              Interests:
            </span>
            <div className="interest-tags">
              {interests.map((interest, idx) => (
                <span key={idx} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="trip-card-actions">
        <button 
          className="card-action-btn view-btn"
          onClick={() => navigate(`/trips/${tripId}`)}
          title="View Details"
        >
          <Eye size={16} />
          <span>View</span>
        </button>
        <button 
          className="card-action-btn edit-btn"
          onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
          title="Edit Trip"
        >
          <Edit size={16} />
        </button>
        <button 
          className="card-action-btn delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(trip); }}
          title="Delete Trip"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TripCard;
