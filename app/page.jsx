import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import EventCard from '@/components/EventCard';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import Newsletter from '@/components/Newsletter';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import './home.scss';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Eventify — Plan, Discover & Book Amazing Events',
  description: 'Discover and book the best events in your city.',
};



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

    // Return real events without fallbacks
    return {
      featured:  serializedFeatured,
      upcoming:  serializedUpcoming,
      categoryCounts,
      isEmpty:   allEvents.length === 0,
    };
  } catch {
    // DB unreachable
    return {
      featured: [],
      upcoming: [],
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
      {upcoming.length > 0 && (
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
      )}

      {/* 4. Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-top-row" style={{ justifyContent: 'center' }}>
            <div>
              <h2 style={{ textAlign: 'center' }}>Browse by <span className="gradient-text">Category</span></h2>
            </div>
          </div>
          <div className="categories-grid">
            {CATEGORIES.slice(0, 6).map(name => (
              <CategoryCard key={name} name={name} count={categoryCounts[name] || 0} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Info Sections */}
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />

      {/* 5. Newsletter */}
      <Newsletter />
    </div>
  );
}
