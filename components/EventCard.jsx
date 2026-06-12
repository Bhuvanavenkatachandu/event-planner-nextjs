'use client';

import Link from 'next/link';
import './EventCard.scss';

export default function EventCard({ event, userRole }) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
  const isPast      = date < new Date();
  const isSoldOut   = event.availableSeats === 0;
  const isCancelled = event.status === 'cancelled';

  const categoryIcons = {
    Music: '🎵', Sports: '⚽', Technology: '💻', Business: '💼',
    Education: '📚', Food: '🍕', Travel: '✈️', Art: '🎨',
    Workshop: '🛠', Conference: '🎤', Meetup: '🤝', Festival: '🎉', Other: '📌',
  };

  return (
    <div className={`event-card ${isCancelled ? 'cancelled' : ''}`}>
      {/* Image */}
      <div className="event-img-wrap">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'}
          alt={event.title}
          className="event-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'; }}
        />
        <div className="event-img-overlay" />

        {/* Badges */}
        <div className="event-badges">
          <span className="badge badge-primary event-category-badge">
            {categoryIcons[event.category] || '📌'} {event.category}
          </span>
          {event.featured && <span className="badge badge-warning featured-badge">⭐ Featured</span>}
        </div>

        {/* Status overlays */}
        {isCancelled && <div className="event-status-overlay cancelled">Cancelled</div>}
        {isSoldOut && !isCancelled && <div className="event-status-overlay sold-out">Sold Out</div>}
        {isPast && !isCancelled && !isSoldOut && <div className="event-status-overlay past">Past Event</div>}

        {/* Price */}
        <div className="event-price-tag">
          {event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString()}`}
        </div>
      </div>

      {/* Content */}
      <div className="event-body">
        <h3 className="event-title">{event.title}</h3>

        <div className="event-meta">
          <span className="meta-item">📅 {formattedDate}</span>
          <span className="meta-item">🕐 {event.time}</span>
          <span className="meta-item">📍 {event.location}</span>
        </div>

        <div className="event-footer">
          <div className="seats-info">
            {isSoldOut
              ? <span className="seats-sold-out">🔴 Sold Out</span>
              : <span className="seats-left">🟢 {event.availableSeats} seats left</span>
            }
          </div>
          <Link
            href={`/events/${event._id}`}
            className="btn btn-primary btn-sm view-btn"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
