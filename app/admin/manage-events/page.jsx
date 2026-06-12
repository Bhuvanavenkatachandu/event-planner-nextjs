'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function ManageEventsPage() {
  const router = useRouter();
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(user => {
        if (user.role !== 'admin') { router.push('/unauthorized'); return; }
        return fetch('/api/events', { headers: { Authorization: `Bearer ${token}` } });
      })
      .then(r => r?.json())
      .then(data => { if (data?.events) setEvents(data.events); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`/api/events/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e._id !== deleteId));
        setDeleteId(null);
      } else {
        alert('Failed to delete event.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading events..." />;

  const statusColors = { upcoming: 'success', completed: 'user', cancelled: 'danger' };
  const filtered = events.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Manage Events</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{events.length} total events</p>
          </div>
          <Link href="/admin/create-event" className="btn btn-primary">➕ Create New Event</Link>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <Link href="/admin/dashboard" className="btn btn-secondary btn-sm">← Dashboard</Link>
        </div>

        {/* Events List */}
        {filtered.length === 0 ? (
          <EmptyState icon="🎭" title="No Events Found" message="Create your first event to get started." actionLabel="Create Event" actionHref="/admin/create-event" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(event => (
              <div key={event._id} className="card" style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '1.25rem', alignItems: 'center', padding: '1.25rem' }}>
                {/* Image */}
                <div style={{ height: '72px', borderRadius: '10px', overflow: 'hidden' }}>
                  <img
                    src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=200'}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=200'; }}
                  />
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{event.title}</h3>
                    <span className={`badge badge-${statusColors[event.status] || 'secondary'}`}>{event.status}</span>
                    {event.featured && <span className="badge badge-warning">⭐ Featured</span>}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    📅 {new Date(event.date).toLocaleDateString('en-IN')}
                    {' · '} 📍 {event.location}
                    {' · '} 💺 {event.availableSeats}/{event.totalSeats}
                    {' · '} {event.price === 0 ? '🆓 FREE' : `₹${event.price.toLocaleString()}`}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {event.category} · {event.organizerName}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link href={`/events/${event._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontWeight: 600 }}>View</Link>
                  <Link href={`/admin/edit-event/${event._id}`} className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.8rem', fontWeight: 600 }}>Edit</Link>
                  <button onClick={() => setDeleteId(event._id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.8rem', fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ConfirmDeleteModal
          title="Delete Event"
          message="Are you sure you want to delete this event? All associated bookings will also be cancelled."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
