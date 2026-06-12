import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import CategoryCard from '@/components/CategoryCard';
import '../home.scss';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Categories — Eventify',
  description: 'Browse events by category on Eventify.',
};

const CATEGORIES = ['Music','Sports','Technology','Business','Education','Food','Travel','Art','Workshop','Conference','Meetup','Festival'];

export default async function CategoriesPage() {
  let categoryCounts = {};

  try {
    await connectToDatabase();
    
    // Group events by category and count them
    const counts = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    counts.forEach(c => {
      if (c._id) {
        categoryCounts[c._id] = c.count;
      }
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
  }

  return (
    <div className="page-wrapper home-events-section" style={{ minHeight: '80vh', padding: '6rem 0' }}>
      <div className="container">
        <div className="section-top-row" style={{ marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, marginBottom: '0.5rem' }}>
              Popular <span className="gradient-text">Categories</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Find events that match your passion. From music concerts to tech workshops.
            </p>
          </div>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat}
              name={cat}
              count={categoryCounts[cat] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
