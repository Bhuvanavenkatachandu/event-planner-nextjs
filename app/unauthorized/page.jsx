import Link from 'next/link';

export const metadata = {
  title: 'Unauthorized — Eventify',
};

export default function UnauthorizedPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--hero-gradient)',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>🚫</div>
      <h1 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 900,
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Access Denied
      </h1>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '1.1rem',
        maxWidth: '480px',
        lineHeight: 1.7,
        marginBottom: '2.5rem',
      }}>
        You don't have permission to access this page. This area is restricted to administrators only.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/"       className="btn btn-primary">🏠 Go Home</Link>
        <Link href="/events" className="btn btn-secondary">🎟 Browse Events</Link>
        <Link href="/login"  className="btn btn-secondary">🔑 Sign In</Link>
      </div>
    </div>
  );
}
