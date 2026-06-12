'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/EventForm';
import Loader from '@/components/Loader';

export default function CreateEventPage() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(user => {
        if (user.role !== 'admin') { router.push('/unauthorized'); return; }
        setVerified(true);
      })
      .catch(() => router.push('/login'))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <Loader text="Verifying access..." />;
  if (!verified) return null;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Create New Event</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the details below to publish a new event.</p>
        </div>
        <div className="card">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
}
