'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import './Navbar.scss';

// Smooth scroll to a section by id; works whether on homepage or another page
function useHashNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (id) => {
    if (pathname === '/') {
      // Already on homepage — just smooth scroll
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Navigate home first, then scroll after mount
      router.push(`/#${id}`);
    }
  };
}

export default function Navbar() {
  const [user, setUser]         = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();
  const navRef   = useRef(null);

  // Fetch user from token
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setUser(null); return; }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUser();
    // Re-fetch on storage change (cross-tab login/logout)
    const onStorage = () => fetchUser();
    window.addEventListener('storage', onStorage);
    // Custom event for same-tab updates
    window.addEventListener('auth-change', fetchUser);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-change', fetchUser);
    };
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
    router.refresh();
  };

  const isActive = (href) => pathname === href;
  const scrollTo = useHashNav();

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        {/* Logo */}
        <Link 
          href="/" 
          className="nav-logo"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <span className="logo-icon">✦</span>
          <span className="logo-text">Eventify</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          {!user && <li><Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>}
          <li><Link href="/events" className={isActive('/events') ? 'active' : ''}>Events</Link></li>
          <li><Link href="/trending" className={isActive('/trending') ? 'active' : ''}>Trending</Link></li>
          <li><Link href="/categories" className={isActive('/categories') ? 'active' : ''}>Categories</Link></li>
          {!user && <li><button className="nav-hash-btn" onClick={() => scrollTo('about')}>About</button></li>}
          {!user && <li><button className="nav-hash-btn" onClick={() => scrollTo('contact')}>Contact</button></li>}
        </ul>

        {/* Desktop Auth Area */}
        <div className="nav-auth">
          <ThemeToggle />

          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span className={`role-badge badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {user.role}
                </span>
              </div>

              {user.role === 'admin' ? (
                <>
                  <Link href="/admin/dashboard"     className="btn btn-sm btn-secondary">Dashboard</Link>
                  <Link href="/admin/create-event"  className="btn btn-sm btn-secondary">Create Event</Link>
                  <Link href="/admin/manage-events" className="btn btn-sm btn-secondary">Manage</Link>
                </>
              ) : (
                <Link href="/my-bookings" className="btn btn-sm btn-secondary">My Bookings</Link>
              )}

              <button onClick={handleLogout} className="btn btn-sm btn-danger">Logout</button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link href="/login"    className="btn btn-sm btn-outline">Login</Link>
              <Link href="/register" className="btn btn-sm btn-primary">Register</Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-links">
          {!user && <li><Link href="/">Home</Link></li>}
          <li><Link href="/events" onClick={() => setMenuOpen(false)}>Events</Link></li>
          <li><Link href="/trending" onClick={() => setMenuOpen(false)}>Trending</Link></li>
          <li><Link href="/categories" onClick={() => setMenuOpen(false)}>Categories</Link></li>
          {!user && <li><button className="nav-hash-btn" onClick={() => { scrollTo('about'); setMenuOpen(false); }}>About</button></li>}
          {!user && <li><button className="nav-hash-btn" onClick={() => { scrollTo('contact'); setMenuOpen(false); }}>Contact</button></li>}
        </ul>

        <div className="mobile-auth">
          {user ? (
            <>
              <div className="mobile-user">
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <div>
                  <p className="user-name">{user.name}</p>
                  <span className={`role-badge badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {user.role === 'admin' ? (
                <>
                  <Link href="/admin/dashboard"     className="mobile-link-btn">📊 Dashboard</Link>
                  <Link href="/admin/create-event"  className="mobile-link-btn">➕ Create Event</Link>
                  <Link href="/admin/manage-events" className="mobile-link-btn">🗂 Manage Events</Link>
                </>
              ) : (
                <Link href="/my-bookings" className="mobile-link-btn">🎟 My Bookings</Link>
              )}

              <button onClick={handleLogout} className="btn btn-danger btn-block">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login"    className="btn btn-outline btn-block">Login</Link>
              <Link href="/register" className="btn btn-primary btn-block">Register</Link>
            </>
          )}
          <div className="mobile-theme"><ThemeToggle /></div>
        </div>
      </div>
    </nav>
  );
}
