import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import './index.css';

const DayCard = ({ dayNumber, activities = [], onRegenerate }) => {
  return (
    <div className="day-card-container">
      <div className="day-card-header">
        <h3 className="day-card-title">Day {dayNumber}</h3>
        <button 
          className="regenerate-day-btn"
          onClick={() => onRegenerate(dayNumber)}
          title="Regenerate Day Plan with AI"
        >
          <Sparkles size={14} />
          <span>Regenerate Day</span>
        </button>
      </div>

      <div className="day-card-body">
        {activities.length > 0 ? (
          <div className="timeline-container">
            {activities.map((activity, index) => {
              // Extract text if activity is an object, or support string directly
              const activityText = typeof activity === 'string' ? activity : (activity?.activity || activity?.description || JSON.stringify(activity));
              const activityTime = activity?.time || null;
              
              return (
                <div key={index} className="timeline-item">
                  <div className="timeline-badge">
                    <div className="timeline-circle">
                      <MapPin size={12} />
                    </div>
                    {index < activities.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    {activityTime && <span className="timeline-time">{activityTime}</span>}
                    <p className="timeline-description">{activityText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty-activities-text">No activities scheduled for this day.</p>
        )}
      </div>
    </div>
  );
};

export default DayCard;
