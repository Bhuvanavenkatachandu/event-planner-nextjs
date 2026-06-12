import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import SearchBar from '@/components/SearchBar';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import '../home.scss';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Events — Eventify',
  description: 'Browse and search all events on Eventify.',
};

export default async function EventsPage({ searchParams }) {
  const sp       = await searchParams;
  const search   = sp?.search   || '';
  const category = sp?.category || '';
  const sort     = sp?.sort     || 'latest';
  const featured = sp?.featured || '';
  const free     = sp?.free     || '';

  let events = [];
  let total  = 0;

  try {
    await connectToDatabase();

    const query = {};
    if (search) {
      query.$or = [
        { title:         { $regex: search, $options: 'i' } },
        { location:      { $regex: search, $options: 'i' } },
        { category:      { $regex: search, $options: 'i' } },
        { organizerName: { $regex: search, $options: 'i' } },
      ];
    }
    if (category)          query.category  = category;
    if (featured === 'true') query.featured = true;
    if (free === 'true')   query.price     = 0;

    let sortOpt = {};
    switch (sort) {
      case 'date-asc':   sortOpt = { date: 1 };       break;
      case 'date-desc':  sortOpt = { date: -1 };      break;
      case 'price-asc':  sortOpt = { price: 1 };      break;
      case 'price-desc': sortOpt = { price: -1 };     break;
      default:           sortOpt = { createdAt: -1 }; break;
    }

    const raw = await Event.find(query).sort(sortOpt).lean();
    total = raw.length;

    events = raw.map(e => ({
      ...e,
      _id:       e._id.toString(),
      createdBy: e.createdBy?.toString() || '',
      date:      e.date instanceof Date ? e.date.toISOString() : e.date,
      createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
      updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
    }));
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>
            {category ? `${category} Events` : search ? `Search: "${search}"` : 'All Events'}
          </h1>
          <p>{total} event{total !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search & Filter */}
        <SearchBar />

        {/* Quick filter pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Link href="/events" className={`badge ${!category && !featured && !free ? 'badge-primary' : 'badge-secondary'}`} style={{ cursor: 'pointer', textDecoration: 'none' }}>
            All
          </Link>
          <Link href="/events?featured=true" className={`badge ${featured ? 'badge-primary' : 'badge-secondary'}`} style={{ cursor: 'pointer', textDecoration: 'none' }}>
            ⭐ Featured
          </Link>
          <Link href="/events?free=true" className={`badge ${free ? 'badge-primary' : 'badge-secondary'}`} style={{ cursor: 'pointer', textDecoration: 'none' }}>
            🆓 Free Events
          </Link>
          <Link href="/events?sort=date-asc" className="badge badge-secondary" style={{ cursor: 'pointer', textDecoration: 'none' }}>
            📅 Nearest Date
          </Link>
          <Link href="/events?sort=price-asc" className="badge badge-secondary" style={{ cursor: 'pointer', textDecoration: 'none' }}>
            💰 Lowest Price
          </Link>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="events-grid">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No Events Found"
            message={search ? `No events match "${search}". Try a different search.` : 'No events available right now. Check back soon!'}
            actionLabel="Clear Search"
            actionHref="/events"
          />
        )}
      </div>
    </div>
  );
}
