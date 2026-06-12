'use client';

export default function Testimonials() {
  const testimonials = [

    {
      name: 'Aarav Sharma',
      role: 'Event Enthusiast · Mumbai',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav&backgroundColor=b6e3f4',
      review: 'Booking events on Eventify is incredibly easy and fast. The UI is clean, modern, and the checkout process takes less than a minute. Absolutely love it!',
      rating: 5,
    },
    {
      name: 'Priya Nair',
      role: 'Tech Community Lead · Hyderabad',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc',
      review: 'The dark mode UI feels absolutely futuristic. I use Eventify to discover tech meetups and workshops every week. The seat availability feature is a game changer!',
      rating: 5,
    },
    {
      name: 'Rohan Mehta',
      role: 'Event Organizer · Bengaluru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan&backgroundColor=c0aede',
      review: 'As an admin, managing events is a breeze. Creating, updating, and tracking bookings from the dashboard is super intuitive. Best admin UX I\'ve seen!',
      rating: 5,
    },
  ];

  const platformStats = [
    { value: '500+', label: 'Events Hosted' },
    { value: '10k+', label: 'Tickets Booked' },
    { value: '100+', label: 'Organizers' },
    { value: '4.9★', label: 'User Rating' },
  ];

  return (
    <section className="section testi-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">💬 Testimonials</div>
          <h2>Trusted by <span className="gradient-text">Event Lovers</span></h2>
          <p>Don't take our word for it — hear from thousands of happy users who use Eventify every week.</p>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testi-card glass-card">
              <div className="testi-stars">
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p className="testi-review">"{t.review}"</p>
              <div className="testi-author">
                <img src={t.avatar} alt={t.name} className="testi-avatar" onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${t.name}&background=7c3aed&color=fff`; }} />
                <div>
                  <p className="testi-name">{t.name}</p>
                  <p className="testi-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Stats */}
        <div className="platform-stats">
          {platformStats.map((s, i) => (
            <div key={i} className="ps-item">
              <span className="ps-value gradient-text">{s.value}</span>
              <span className="ps-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
