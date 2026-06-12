'use client';

export default function WhyChooseUs() {
  const features = [
    { icon: '💺', title: 'Real-time Seat Availability', desc: 'See exactly how many seats remain. Bookings update instantly — no overbooking, ever.' },
    { icon: '🔐', title: 'Secure JWT Authentication', desc: 'Your account is protected with industry-standard JWT tokens and bcrypt password hashing.' },
    { icon: '⚡', title: 'Lightning Fast Booking', desc: 'Complete your booking in under 60 seconds. No forms, no waiting, no complications.' },
    { icon: '👑', title: 'Powerful Admin Dashboard', desc: 'Organizers get full control — create, edit, delete events, and track bookings in real time.' },
    { icon: '📱', title: 'Mobile-first Design', desc: 'Looks stunning on every screen — mobile, tablet, or desktop. Fully responsive.' },
    { icon: '🌗', title: 'Dark / Light Theme', desc: 'Switch between beautiful dark and light themes with a single click. Your eyes will thank you.' },
  ];

  return (
    <section className="section wcu-section" id="about">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🏆 Why Eventify</div>
          <h2>Why <span className="gradient-text">Choose Us?</span></h2>
          <p>We've built the most feature-rich event booking experience on the web. Here's what sets us apart.</p>
        </div>

        <div className="wcu-grid">
          {features.map((f, i) => (
            <div key={i} className="wcu-card glass-card">
              <div className="wcu-icon">{f.icon}</div>
              <h3 className="wcu-title">{f.title}</h3>
              <p className="wcu-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
