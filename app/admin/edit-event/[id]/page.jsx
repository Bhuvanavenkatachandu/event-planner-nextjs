'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/EventForm';
import Loader from '@/components/Loader';

export default function EditEventPage({ params }) {
  const router = useRouter();
  const [event,    setEvent]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      try {
        const { id } = await params;

        // Verify admin
        const meRes = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        const me    = await meRes.json();
        if (me.role !== 'admin') { router.push('/unauthorized'); return; }

        // Fetch event
        const evRes = await fetch(`/api/events/${id}`);
        const evData = await evRes.json();
        if (!evRes.ok) { setError('Event not found.'); return; }

        setEvent(evData.event);
      } catch {
        setError('Failed to load event.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <Loader text="Loading event..." />;
  if (error)   return <div className="container" style={{ padding: '4rem 0' }}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-tag" style={{ marginBottom: '0.5rem' }}>👑 Admin Panel</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Edit Event</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Update the details for "{event?.title}"</p>
        </div>
        <div className="card">
          <EventForm mode="edit" eventData={event} />
        </div>
      </div>
    </div>
  );
}
