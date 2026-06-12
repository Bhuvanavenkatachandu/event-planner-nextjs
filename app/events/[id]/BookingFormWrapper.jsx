'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookingForm from '@/components/BookingForm';

export default function BookingFormWrapper({ event }) {
  const router = useRouter();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setUser(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/events/${event._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert('Event deleted.');
      router.push('/admin/manage-events');
    } else {
      alert('Failed to delete event.');
    }
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  // Admin view
  if (user?.role === 'admin') {
    return (
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.2)' }}>
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: '1rem' }}>⚙️ Admin Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href={`/admin/edit-event/${event._id}`} className="btn btn-primary btn-block">
            ✏️ Edit Event
          </Link>
          <button onClick={handleDelete} className="btn btn-danger btn-block">
            🗑️ Delete Event
          </button>
          <Link href="/admin/manage-events" className="btn btn-secondary btn-block">
            🗂 Manage All Events
          </Link>
        </div>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <p><strong>Total Seats:</strong> {event.totalSeats}</p>
          <p><strong>Available:</strong> {event.availableSeats}</p>
          <p><strong>Booked:</strong> {event.totalSeats - event.availableSeats}</p>
        </div>
      </div>
    );
  }

  // Logged-in user view
  if (user?.role === 'user') {
    return <BookingForm event={event} />;
  }

  // Visitor view
  return (
    <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(124,58,237,0.2)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>Login to Book</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Please sign in to your account to book tickets for this event.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link href="/login" className="btn btn-primary btn-block">🔑 Sign In</Link>
        <Link href="/register" className="btn btn-secondary btn-block">🚀 Create Account</Link>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        Price: <strong>{event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString()}`}</strong> per ticket
      </p>
    </div>
  );
}
