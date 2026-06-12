'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardCard from '@/components/DashboardCard';
import Loader from '@/components/Loader';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(user => {
        if (user.role !== 'admin') { router.push('/unauthorized'); return; }
        return fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
      })
      .then(r => r?.json())
      .then(data => {
        if (data) setStats(data);
      })
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error)   return <div className="container" style={{ padding: '4rem 0' }}><div className="alert alert-error">{error}</div></div>;
  if (!stats)  return null;

  const statCards = [
    { icon: '🎭', title: 'Total Events',     value: stats.totalEvents,    color: 'purple' },
    { icon: '🎟', title: 'Total Bookings',   value: stats.totalBookings,  color: 'blue'   },
    { icon: '👥', title: 'Total Users',      value: stats.totalUsers,     color: 'green'  },
    { icon: '📅', title: 'Upcoming Events',  value: stats.upcomingEvents, color: 'orange' },
    { icon: '💰', title: 'Revenue Estimate', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: 'pink' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening on Eventify.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/admin/create-event"  className="btn btn-primary btn-sm">➕ Create Event</Link>
            <Link href="/admin/manage-events" className="btn btn-secondary btn-sm">🗂 Manage Events</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          {statCards.map(c => (
            <DashboardCard key={c.title} icon={c.icon} title={c.title} value={c.value} color={c.color} />
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>
              📋 Recent Bookings
            </h2>
          </div>

          {stats.recentBookings?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['User', 'Event', 'Tickets', 'Amount', 'Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <p style={{ fontWeight: 600 }}>{b.userId?.name || 'Unknown'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userId?.email || ''}</p>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <p style={{ fontWeight: 600, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.eventId?.title || 'Deleted'}
                        </p>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>{b.numberOfTickets}</td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--accent)' }}>
                        {b.totalAmount === 0 ? 'FREE' : `₹${b.totalAmount.toLocaleString()}`}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-danger'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
              <p>No bookings yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
