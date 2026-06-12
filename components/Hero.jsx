'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setUser(data); })
        .catch(() => {});
    }
    const onAuth = () => {
      const t = localStorage.getItem('token');
      if (t) {
        fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })
          .then(r => r.ok ? r.json() : null)
          .then(data => setUser(data))
          .catch(() => {});
      } else { setUser(null); }
    };
    window.addEventListener('auth-change', onAuth);
    return () => window.removeEventListener('auth-change', onAuth);
  }, []);

  const STATEMENTS = [
    "Discover your next adventure",
    "Experience unforgettable moments",
    "Connect with the community",
    "Create memories that last"
  ];

  const VIDEOS = [
    "/hero-bg-1.mp4",
    "/hero-bg-2.mp4",
    "/hero-bg-3.mp4",
    "/hero-bg-4.mp4"
  ];

  const POSTERS = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200"
  ];

  const [statementIndex, setStatementIndex] = useState(0);
  const [fade, setFade] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFade('fade-out');
      setTimeout(() => {
        setStatementIndex((prev) => (prev + 1) % STATEMENTS.length);
        setFade('fade-in');
      }, 500); // matches fade transition duration
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-video-bg">
        {VIDEOS.map((src, idx) => (
          <video
            key={src}
            autoPlay
            loop
            muted
            playsInline
            poster={POSTERS[idx]}
            className="hero-video"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: statementIndex === idx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: statementIndex === idx ? 1 : 0
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        <div className="hero-overlay"></div>
      </div>

      <div className="container hero-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '2rem', paddingTop: '6rem', paddingBottom: '6rem', zIndex: 2 }}>
        
        <div className="hero-text-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '800px', zIndex: 2 }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)', minHeight: '2.4em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span className={`${fade}`} style={{ display: 'inline-block', background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 2px 20px rgba(139, 92, 246, 0.3))' }}>
              {STATEMENTS[statementIndex]}
            </span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: 'rgba(241, 245, 249, 0.9)', lineHeight: 1.6, maxWidth: '600px', opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards', animationDelay: '0.2s', textShadow: '0 1px 8px rgba(0, 0, 0, 0.2)' }}>
            Curated events, premium venues, and unforgettable moments. 
            Explore the city's most anticipated gatherings and secure your spot effortlessly.
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem', opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards', animationDelay: '0.4s' }}>
            <Link href="/events" className="btn btn-primary btn-lg" style={{ padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 600 }}>
              Browse Events
            </Link>
            {!user && (
              <Link href="/register" className="btn btn-outline-white btn-lg" style={{ padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 600 }}>
                Join Now
              </Link>
            )}
            {user?.role === 'user' && (
              <Link href="/my-bookings" className="btn btn-outline-white btn-lg" style={{ padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 600 }}>
                My Bookings
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="btn btn-outline-white btn-lg" style={{ padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 600 }}>
                Dashboard
              </Link>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
