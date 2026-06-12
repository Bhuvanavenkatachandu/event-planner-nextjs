'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState(null); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setLoading(true);
    // Simulate subscription (in real app, call an API)
    await new Promise(r => setTimeout(r, 1000));
    setStatus('success');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-glow-1" />
      <div className="newsletter-glow-2" />
      <div className="container">
        <div className="newsletter-card glass-card">
          <div className="newsletter-content">
            <div className="nl-icon">📬</div>
            <h2 className="nl-title">Stay in the <span className="gradient-text">Loop</span></h2>
            <p className="nl-desc">
              Get weekly updates on the hottest events near you. No spam — just the events you'll love.
            </p>

            {status === 'success' ? (
              <div className="nl-success">
                <span style={{ fontSize: '2rem' }}>🎉</span>
                <p>You're subscribed! Welcome to the Eventify community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="nl-form">
                <div className="nl-input-wrap">
                  <span className="nl-input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setStatus(null); }}
                    className="nl-input"
                    required
                  />
                </div>
                {status === 'error' && (
                  <p className="nl-error">Please enter a valid email address.</p>
                )}
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? '⏳ Subscribing...' : '🚀 Subscribe Now'}
                </button>
              </form>
            )}

            <p className="nl-note">Join 10,000+ event enthusiasts. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
