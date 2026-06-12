'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader';
import './bookings.scss';

export default function MyBookingsPage() {
  const router = useRouter();
  const [user,       setUser]       = useState(null);
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [cancelling, setCancelling] = useState(null);
  const [filter,     setFilter]     = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const [meRes, bookRes] = await Promise.all([
          fetch('/api/auth/me',              { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/bookings/my-bookings', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!meRes.ok) { localStorage.removeItem('token'); router.push('/login'); return; }
        const meData = await meRes.json();
        const bkData = await bookRes.json();
        setUser(meData);
        setBookings(bkData.bookings || []);
      } catch {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to cancel.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <Loader text="Loading your bookings..." />;

  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');
  const totalSpent = confirmed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const filtered = filter === 'all' ? bookings
    : filter === 'confirmed' ? confirmed
    : cancelled;

  const stats = [
    { label: 'Total Bookings',  value: bookings.length,  icon: '🎟',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Active Tickets',  value: confirmed.length, icon: '✅',  color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
    { label: 'Cancelled',       value: cancelled.length, icon: '🚫',  color: '#f87171', bg: 'rgba(248,113,113,0.12)'},
    { label: 'Total Spent',     value: totalSpent === 0 ? 'FREE' : `₹${totalSpent.toLocaleString()}`, icon: '💰', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  ];

  return (
    <div className="bookings-page">
      <div className="container bookings-body">
        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Stats ── */}
        <div className="bookings-stats">
          {stats.map(s => (
            <div key={s.label} className="bstat-card" style={{ '--stat-color': s.color, '--stat-bg': s.bg }}>
              <div className="bstat-icon">{s.icon}</div>
              <div className="bstat-value">{s.value}</div>
              <div className="bstat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filter Tabs ── */}
        {bookings.length > 0 && (
          <div className="bookings-tabs">
            {[
              { key: 'all',       label: `All (${bookings.length})` },
              { key: 'confirmed', label: `Active (${confirmed.length})` },
              { key: 'cancelled', label: `Cancelled (${cancelled.length})` },
            ].map(t => (
              <button
                key={t.key}
                className={`bookings-tab ${filter === t.key ? 'active' : ''}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Booking Cards ── */}
        {filtered.length === 0 ? (
          <div className="bookings-empty">
            <div className="bookings-empty-icon">🎟</div>
            <h3>No Bookings Found</h3>
            <p>{filter === 'all' ? "You haven't booked any events yet." : `No ${filter} bookings.`}</p>
            {filter === 'all' && (
              <Link href="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Browse Events →
              </Link>
            )}
          </div>
        ) : (
          <div className="booking-cards">
            {filtered.map((booking, i) => {
              const event     = booking.eventId;
              const isActive  = booking.status === 'confirmed';
              const isPast    = event && new Date(event.date) < new Date();
              const canCancel = isActive && !isPast && event?.status !== 'cancelled';
              const dateStr   = event
                ? new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
                : '—';

              return (
                <div
                  key={booking._id}
                  className={`bcard ${isActive ? 'bcard-active' : 'bcard-cancelled'}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {/* Status ribbon */}
                  <div className={`bcard-ribbon ${isActive ? 'ribbon-active' : 'ribbon-cancelled'}`}>
                    {isActive ? (isPast ? 'Past' : 'Confirmed') : 'Cancelled'}
                  </div>

                  {/* Left — image */}
                  <div className="bcard-img-wrap">
                    {event ? (
                      <img
                        src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400'}
                        alt={event.title}
                        className="bcard-img"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400'; }}
                      />
                    ) : (
                      <div className="bcard-img-placeholder">🎟</div>
                    )}
                    <div className="bcard-img-overlay" />
                    {event?.category && (
                      <span className="bcard-cat-badge">{event.category}</span>
                    )}
                  </div>

                  {/* Ticket perforation */}
                  <div className="bcard-perforation">
                    <div className="perf-circle top" />
                    <div className="perf-dashes" />
                    <div className="perf-circle bottom" />
                  </div>

                  {/* Right — info */}
                  <div className="bcard-info">
                    <div className="bcard-info-top">
                      <h3 className="bcard-title">
                        {event ? event.title : 'Event Deleted'}
                      </h3>

                      <div className="bcard-meta">
                        <div className="bcard-meta-item">
                          <span className="meta-icon">📅</span>
                          <span>{dateStr}</span>
                        </div>
                        {event?.time && (
                          <div className="bcard-meta-item">
                            <span className="meta-icon">🕐</span>
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event?.location && (
                          <div className="bcard-meta-item">
                            <span className="meta-icon">📍</span>
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking details row */}
                    <div className="bcard-details-row">
                      <div className="bcard-detail-chip">
                        <span className="chip-label">Tickets</span>
                        <span className="chip-value">{booking.numberOfTickets}</span>
                      </div>
                      <div className="bcard-detail-chip">
                        <span className="chip-label">Amount</span>
                        <span className="chip-value highlight">
                          {booking.totalAmount === 0 ? 'FREE' : `₹${booking.totalAmount?.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="bcard-detail-chip">
                        <span className="chip-label">Booked On</span>
                        <span className="chip-value">
                          {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bcard-actions">
                      {event && (
                        <Link href={`/events/${event._id}`} className="btn btn-secondary btn-sm">
                          View Event →
                        </Link>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="btn btn-danger btn-sm"
                          disabled={cancelling === booking._id}
                        >
                          {cancelling === booking._id ? '⏳ Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                      {!isActive && (
                        <Link href="/events" className="btn btn-outline btn-sm">
                          Book Again
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
