'use client';

export default function HowItWorks() {
  const steps = [
    { icon: '🔭', step: '01', title: 'Explore Events', desc: 'Browse hundreds of events across categories — music, tech, workshops, and more. No login needed.' },
    { icon: '👤', step: '02', title: 'Create Account', desc: 'Register in seconds. No credit card required. Login securely with your email and password.' },
    { icon: '🎟️', step: '03', title: 'Book Your Seat', desc: 'Select your tickets, confirm the booking, and your seat is reserved instantly. It\'s that simple.' },
    { icon: '🎊', step: '04', title: 'Enjoy the Event', desc: 'Show up, have fun, and create unforgettable memories. Cancel anytime if your plans change.' },
  ];

  return (
    <section className="section hiw-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">✨ Simple Process</div>
          <h2>How It <span className="gradient-text">Works</span></h2>
          <p>From discovery to experience — booking an event has never been easier.</p>
        </div>

        <div className="hiw-grid">
          {steps.map((s, i) => (
            <div key={i} className="hiw-card">
              <div className="hiw-step-num">{s.step}</div>
              <div className="hiw-icon">{s.icon}</div>
              <h3 className="hiw-title">{s.title}</h3>
              <p className="hiw-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="hiw-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
