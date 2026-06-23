import React from 'react';
import './index.css';

const Loader = ({ type = 'spinner', variant = 'card', count = 3, fullScreen = false, message = '' }) => {
  if (type === 'spinner') {
    return (
      <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
        <div className="spinner-wrapper">
          <div className="travel-spinner">
            <svg viewBox="0 0 24 24" className="plane-svg">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }

  if (type === 'skeleton') {
    const items = Array.from({ length: count });

    if (variant === 'card') {
      return (
        <div className="skeleton-grid">
          {items.map((_, idx) => (
            <div className="skeleton-card" key={idx}>
              <div className="skeleton-image pulse" />
              <div className="skeleton-body">
                <div className="skeleton-title pulse" />
                <div className="skeleton-text pulse" />
                <div className="skeleton-text-short pulse" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (variant === 'detail') {
      return (
        <div className="skeleton-detail">
          <div className="skeleton-header-box pulse" />
          <div className="skeleton-content-row">
            <div className="skeleton-main pulse" />
            <div className="skeleton-side pulse" />
          </div>
        </div>
      );
    }

    if (variant === 'list') {
      return (
        <div className="skeleton-list">
          {items.map((_, idx) => (
            <div className="skeleton-list-item pulse" key={idx} />
          ))}
        </div>
      );
    }
  }

  return null;
};

export default Loader;
