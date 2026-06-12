import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import '../home.scss';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Trending Events — Eventify',
  description: 'Discover the most popular events based on recent bookings.',
};

export default async function TrendingPage() {
  let trendingEvents = [];

  try {
    await connectToDatabase();

    // Aggregate bookings by eventId, summing total tickets, sorted by popularity
    const topBookings = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: '$eventId', totalBooked: { $sum: '$numberOfTickets' } } },
      { $sort: { totalBooked: -1 } },
      { $limit: 10 }
    ]);

    const eventIds = topBookings.map(b => b._id);
    const rawEvents = await Event.find({ _id: { $in: eventIds } }).lean();
    
    const eventMap = {};
    rawEvents.forEach(e => {
      eventMap[e._id.toString()] = e;
    });

    trendingEvents = topBookings
      .map(b => {
        const e = eventMap[b._id.toString()];
        if (!e) return null;
        return {
          ...e,
          _id: e._id.toString(),
          createdBy: e.createdBy?.toString() || '',
          date: e.date instanceof Date ? e.date.toISOString() : e.date,
          createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
          updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
          totalBooked: b.totalBooked
        };
      })
      .filter(Boolean);

    // Pad with latest upcoming events if we have less than 10
    if (trendingEvents.length < 10) {
      const needed = 10 - trendingEvents.length;
      const existingIds = trendingEvents.map(e => e._id);
      
      const now = new Date();
      const latestEvents = await Event.find({
        _id: { $nin: existingIds },
        status: 'upcoming',
        date: { $gte: now }
      })
      .sort({ createdAt: -1 }) // latest upcoming
      .limit(needed)
      .lean();

      latestEvents.forEach(e => {
        trendingEvents.push({
          ...e,
          _id: e._id.toString(),
          createdBy: e.createdBy?.toString() || '',
          date: e.date instanceof Date ? e.date.toISOString() : e.date,
          createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
          updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
          totalBooked: 0,
          isNewPadding: true
        });
      });
    }

  } catch (err) {
    console.error('Error fetching trending events:', err);
  }

  return (
    <div className="page-wrapper home-events-section" style={{ minHeight: '80vh', padding: '6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-top-row" style={{ marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, marginBottom: '0.5rem' }}>
              🔥 Trending Events
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Discover what's hot right now based on user bookings.
            </p>
          </div>
          <Link href="/events" className="view-all">Browse All Events →</Link>
        </div>

        {/* Events Grid */}
        {trendingEvents.length > 0 ? (
          <div className="events-grid trending-grid">
            {trendingEvents.map((event, index) => (
              <div key={event._id} className="trending-card-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Ranking Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  background: event.isNewPadding ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--accent), var(--accent3))',
                  color: 'white',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  zIndex: 10,
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                  fontSize: '1rem',
                  border: '2px solid var(--bg)'
                }}>
                  {event.isNewPadding ? 'NEW' : `#${index + 1}`}
                </div>
                
                <EventCard event={event} />
                
                {/* Small indicator for bookings */}
                {!event.isNewPadding && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    textAlign: 'center',
                    background: 'rgba(124, 58, 237, 0.08)',
                    padding: '0.3rem',
                    borderRadius: '8px'
                  }}>
                    {event.totalBooked} Tickets Booked
                  </div>
                )}
                {event.isNewPadding && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#10b981',
                    fontWeight: 600,
                    textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.08)',
                    padding: '0.3rem',
                    borderRadius: '8px'
                  }}>
                    Latest Upcoming
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔥"
            title="No Trending Events Yet"
            message="Events will appear here once they start getting bookings. Check back soon!"
            actionLabel="Browse Events"
            actionHref="/events"
          />
        )}
      </div>
    </div>
  );
}
