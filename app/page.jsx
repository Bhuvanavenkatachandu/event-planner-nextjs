import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import EventCard from '@/components/EventCard';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import Newsletter from '@/components/Newsletter';
import './home.scss';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Eventify — Plan, Discover & Book Amazing Events',
  description: 'Discover and book the best events in your city.',
};

// ---------- Static fallback events (shown when DB is empty) ----------
const FALLBACK_EVENTS = [
  {
    _id: 'f1', title: 'Future Tech Summit 2026', category: 'Technology',
    date: new Date(Date.now() + 7 * 86400000).toISOString(), time: '09:00 AM',
    location: 'Hyderabad International Convention Centre',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    organizerName: 'TechWorld India', price: 1500, availableSeats: 487, totalSeats: 500,
    status: 'upcoming', featured: true, createdBy: '',
    description: 'Join the most innovative minds at the Future Tech Summit. Experience cutting-edge technology demonstrations, keynote speeches from industry leaders.',
  },
  {
    _id: 'f2', title: 'Neon Music Festival', category: 'Music',
    date: new Date(Date.now() + 14 * 86400000).toISOString(), time: '06:00 PM',
    location: 'HITEX Exhibition Centre, Hyderabad',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    organizerName: 'Neon Events Co.', price: 800, availableSeats: 1842, totalSeats: 2000,
    status: 'upcoming', featured: true, createdBy: '',
    description: 'A dazzling night of live music performances featuring top artists and DJs. Experience futuristic light shows and incredible sound systems.',
  },
  {
    _id: 'f3', title: 'Full-Stack Dev Bootcamp', category: 'Workshop',
    date: new Date(Date.now() + 10 * 86400000).toISOString(), time: '09:30 AM',
    location: 'T-Hub, Hyderabad',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=800',
    organizerName: 'DevSkills Academy', price: 3000, availableSeats: 23, totalSeats: 60,
    status: 'upcoming', featured: true, createdBy: '',
    description: 'Intensive 2-day workshop covering React, Next.js, Node.js, and MongoDB. Build real-world projects with senior developer mentors.',
  },
  {
    _id: 'f4', title: 'Global Business Conference', category: 'Business',
    date: new Date(Date.now() + 21 * 86400000).toISOString(), time: '10:00 AM',
    location: 'The Westin Hyderabad Mindspace',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=800',
    organizerName: 'BizGrow India', price: 2500, availableSeats: 212, totalSeats: 300,
    status: 'upcoming', featured: false, createdBy: '',
    description: 'Connect with 500+ entrepreneurs and business leaders. Learn strategies for scaling startups and investment opportunities.',
  },
  {
    _id: 'f5', title: 'Startup Founders Meetup', category: 'Meetup',
    date: new Date(Date.now() + 5 * 86400000).toISOString(), time: '06:30 PM',
    location: 'WeWork Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    organizerName: 'Startup Hyderabad', price: 0, availableSeats: 98, totalSeats: 150,
    status: 'upcoming', featured: false, createdBy: '',
    description: 'Informal gathering for startup founders to share experiences, investor pitches, and after-party networking.',
  },
  {
    _id: 'f6', title: 'Food & Culture Festival', category: 'Food',
    date: new Date(Date.now() + 45 * 86400000).toISOString(), time: '11:00 AM',
    location: 'Necklace Road, Hyderabad',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    organizerName: 'Hyderabad Heritage Trust', price: 200, availableSeats: 4321, totalSeats: 5000,
    status: 'upcoming', featured: false, createdBy: '',
    description: 'Celebrate diverse culinary traditions. Over 80 food stalls, live cooking demos, cultural performances and art installations.',
  },
];

async function getEvents() {
  try {
    await connectToDatabase();
    const now = new Date();

    const featured  = await Event.find({ featured: true, status: 'upcoming' }).sort({ date: 1 }).limit(4).lean();
    const upcoming  = await Event.find({ status: 'upcoming', date: { $gte: now } }).sort({ date: 1 }).limit(6).lean();
    const allEvents = await Event.find({}).lean();

    const serialize = (arr) => arr.map(e => ({
      ...e,
      _id:       e._id.toString(),
      createdBy: e.createdBy?.toString() || '',
      date:      e.date instanceof Date ? e.date.toISOString() : e.date,
      createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
      updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
    }));

    // Count events per category
    const categoryCounts = {};
    allEvents.forEach(e => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    const serializedFeatured = serialize(featured.length ? featured : upcoming.slice(0, 4));
    const serializedUpcoming = serialize(upcoming);

    // If DB is empty use fallback static data so page always shows content
    return {
      featured:  serializedFeatured.length ? serializedFeatured : FALLBACK_EVENTS.filter(e => e.featured).slice(0, 4),
      upcoming:  serializedUpcoming.length ? serializedUpcoming : FALLBACK_EVENTS,
      categoryCounts,
      isEmpty:   allEvents.length === 0,
    };
  } catch {
    // DB unreachable — show fallback data so page never shows blank
    return {
      featured: FALLBACK_EVENTS.filter(e => e.featured).slice(0, 4),
      upcoming: FALLBACK_EVENTS,
      categoryCounts: {},
      isEmpty: true,
    };
  }
}

const CATEGORIES = ['Music','Sports','Technology','Business','Education','Food','Travel','Art','Workshop','Conference','Meetup','Festival'];

export default async function HomePage() {
  const { featured, upcoming, categoryCounts, isEmpty } = await getEvents();

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <Hero />

      {/* DB Setup Banner — shown when DB is not yet seeded */}
      {isEmpty && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.12))',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '16px',
          padding: '1.25rem 2rem',
          margin: '0 auto',
          maxWidth: '900px',
          marginTop: '-1rem',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌱</span>
            <div>
              <p style={{ fontWeight: 700, marginBottom: '0.1rem' }}>Showing demo events — Connect your database!</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Whitelist your IP in MongoDB Atlas, then seed the DB to load live events &amp; enable login/register.
              </p>
            </div>
          </div>
          <a href="/api/seed" style={{
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            color: 'white', padding: '0.6rem 1.25rem', borderRadius: '10px',
            fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
            textDecoration: 'none', flexShrink: 0,
          }}>
            🚀 Seed Database
          </a>
        </div>
      )}

      {/* 2. Featured Events */}
      {featured.length > 0 && (
        <section className="home-events-section">
          <div className="container">
            <div className="section-top-row">
              <div>
                <h2>Featured <span className="gradient-text">Events</span></h2>
              </div>
              <a href="/events?featured=true" className="view-all">View All →</a>
            </div>
            <div className="events-grid">
              {featured.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Upcoming Events */}
      <section className="home-events-section" style={{ background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <div className="container">
          <div className="section-top-row">
            <div>
              <h2>Upcoming <span className="gradient-text">Events</span></h2>
            </div>
            <a href="/events" className="view-all">View All Events →</a>
          </div>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-track">
            <div className="marquee-content">
              {upcoming.map(event => (
                <EventCard key={`orig-${event._id}`} event={event} />
              ))}
            </div>
            <div className="marquee-content" aria-hidden="true">
              {upcoming.map(event => (
                <EventCard key={`dup-${event._id}`} event={event} />
              ))}
            </div>
          </div>
        </div>
      </section>




      {/* 5. Newsletter */}
      <Newsletter />
    </div>
  );
}
