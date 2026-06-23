import React from 'react';
import { Bed, Star, MapPin } from 'lucide-react';
import './index.css';

const HotelCard = ({ hotel }) => {
  const { name, hotelType, description, priceRange, rating } = hotel || {};

  const getTypeClass = () => {
    switch (hotelType?.toLowerCase()) {
      case 'budget friendly':
      case 'budget':
        return 'type-budget';
      case 'luxury':
        return 'type-luxury';
      case 'mid range':
      case 'midrange':
      default:
        return 'type-mid';
    }
  };

  return (
    <div className="hotel-card-container">
      <div className="hotel-card-image-placeholder">
        <Bed className="hotel-card-bg-icon" size={48} />
        <span className={`hotel-type-badge ${getTypeClass()}`}>
          {hotelType || 'Mid Range'}
        </span>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-card-header-row">
          <h4 className="hotel-name">{name || 'Recommended Hotel'}</h4>
          {rating && (
            <div className="hotel-rating">
              <Star size={14} fill="currentColor" />
              <span>{rating}</span>
            </div>
          )}
        </div>

        <p className="hotel-desc">{description || 'No description available for this recommendation.'}</p>
        
        {priceRange && (
          <div className="hotel-price-row">
            <MapPin size={12} className="hotel-price-icon" />
            <span className="hotel-price-text">{priceRange}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelCard;
