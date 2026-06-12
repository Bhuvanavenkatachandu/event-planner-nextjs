import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import BookingFormWrapper from './BookingFormWrapper';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const event  = await Event.findById(id).lean();
    return { title: event ? `${event.title} — Eventify` : 'Event Not Found' };
  } catch {
    return { title: 'Event — Eventify' };
  }
}

export default async function EventDetailPage({ params }) {
  const { id } = await params;

  await connectToDatabase();
  let event;
  try {
    event = await Event.findById(id).lean();
  } catch {
    notFound();
  }

  if (!event) notFound();

  const serialized = {
    ...event,
    _id:       event._id.toString(),
    createdBy: event.createdBy?.toString() || '',
    date:      event.date instanceof Date ? event.date.toISOString() : event.date,
    createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
    updatedAt: event.updatedAt instanceof Date ? event.updatedAt.toISOString() : event.updatedAt,
  };

  const formattedDate = new Date(serialized.date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const isPast      = new Date(serialized.date) < new Date();
  const isSoldOut   = serialized.availableSeats === 0;
  const isCancelled = serialized.status === 'cancelled';

  const statusColors = { upcoming: '#22c55e', completed: '#3b82f6', cancelled: '#ef4444' };

  return (
    <div className="page-wrapper">
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '380px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <img
          src={serialized.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1400'}
          alt={serialized.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={undefined}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1280px', padding: '0 2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            {serialized.category}
          </span>
          <h1 style={{ color: 'white', fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)', marginBottom: '0.5rem' }}>
            {serialized.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
            by {serialized.organizerName}
          </p>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          {/* Left: Event Details */}
          <div>
            {/* Status */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span className="badge" style={{ background: `${statusColors[serialized.status]}20`, color: statusColors[serialized.status], border: `1px solid ${statusColors[serialized.status]}40` }}>
                {serialized.status === 'upcoming' ? '🟢' : serialized.status === 'completed' ? '🔵' : '🔴'} {serialized.status.charAt(0).toUpperCase() + serialized.status.slice(1)}
              </span>
              {serialized.featured && <span className="badge badge-warning">⭐ Featured</span>}
              {isSoldOut && <span className="badge badge-danger">🔴 Sold Out</span>}
              {isPast    && !isCancelled && <span className="badge badge-secondary">⏰ Past Event</span>}
            </div>

            {/* Event Info Grid */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</p>
                  <p style={{ fontWeight: 600 }}>📅 {formattedDate}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</p>
                  <p style={{ fontWeight: 600 }}>🕐 {serialized.time}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</p>
                  <p style={{ fontWeight: 600 }}>📍 {serialized.location}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organizer</p>
                  <p style={{ fontWeight: 600 }}>👤 {serialized.organizerName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</p>
                  <p style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>
                    {serialized.price === 0 ? '🆓 FREE' : `₹${serialized.price.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seats</p>
                  <p style={{ fontWeight: 600 }}>
                    💺 {serialized.availableSeats} / {serialized.totalSeats} available
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginBottom: '1rem' }}>About This Event</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {serialized.description}
              </p>
            </div>

            {/* Back link */}
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/events" className="btn btn-secondary">← Back to Events</Link>
            </div>
          </div>

          {/* Right: Booking / Admin Panel */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <BookingFormWrapper event={serialized} />
          </div>
        </div>
      </div>
    </div>
  );
}
