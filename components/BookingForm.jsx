'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ event }) {
  const router = useRouter();
  const [tickets, setTickets]   = useState(1);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState(null);
  const [error, setError]       = useState(null);
  const [booked, setBooked]     = useState(false);

  const totalAmount = event.price * tickets;
  const isPast      = new Date(event.date) < new Date();
  const isSoldOut   = event.availableSeats === 0;
  const isCancelled = event.status === 'cancelled';
  const isDisabled  = isPast || isSoldOut || isCancelled || booked;

  const handleBook = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (tickets < 1 || tickets > event.availableSeats) {
      setError(`Please enter between 1 and ${event.availableSeats} tickets.`);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event._id, numberOfTickets: Number(tickets) }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('🎉 Booking confirmed! Check "My Bookings" for details.');
        setBooked(true);
        // Refresh page data after 2s
        setTimeout(() => router.refresh(), 2000);
      } else {
        setError(data.message || 'Booking failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isCancelled) {
    return (
      <div className="booking-box">
        <div className="alert alert-error">🚫 This event has been cancelled and cannot be booked.</div>
      </div>
    );
  }

  if (isPast) {
    return (
      <div className="booking-box">
        <div className="alert alert-warning">⏰ This event has already passed. Booking is closed.</div>
      </div>
    );
  }

  if (isSoldOut) {
    return (
      <div className="booking-box">
        <div className="alert alert-error">🔴 This event is sold out. No more seats available.</div>
      </div>
    );
  }

  return (
    <div className="booking-box glass-card">
      <h3 className="booking-title">Book Your Tickets</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {!booked && (
        <form onSubmit={handleBook} className="booking-form">
          <div className="form-group">
            <label className="form-label">Number of Tickets</label>
            <div className="ticket-counter">
              <button
                type="button"
                className="counter-btn"
                onClick={() => setTickets(v => Math.max(1, v - 1))}
                disabled={tickets <= 1}
              >−</button>
              <input
                type="number"
                className="form-input counter-input"
                value={tickets}
                min={1}
                max={event.availableSeats}
                onChange={e => setTickets(Math.min(event.availableSeats, Math.max(1, Number(e.target.value))))}
              />
              <button
                type="button"
                className="counter-btn"
                onClick={() => setTickets(v => Math.min(event.availableSeats, v + 1))}
                disabled={tickets >= event.availableSeats}
              >+</button>
            </div>
            <p className="form-hint">{event.availableSeats} seats available</p>
          </div>

          {/* Summary */}
          <div className="booking-summary">
            <div className="summary-row">
              <span>Price per ticket</span>
              <span>{event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString()}`}</span>
            </div>
            <div className="summary-row">
              <span>Tickets</span>
              <span>× {tickets}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total Amount</span>
              <span className="total-amount">
                {event.price === 0 ? 'FREE' : `₹${totalAmount.toLocaleString()}`}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading || isDisabled}
          >
            {loading ? '⏳ Processing...' : `🎟 Confirm Booking — ${event.price === 0 ? 'FREE' : `₹${totalAmount.toLocaleString()}`}`}
          </button>
        </form>
      )}

      {booked && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <p style={{ fontWeight: 600, color: 'var(--success)' }}>Booking Confirmed!</p>
        </div>
      )}
    </div>
  );
}
