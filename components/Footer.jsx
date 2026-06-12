import Link from 'next/link';
import './Footer.scss';

export default function Footer() {
  const year = new Date().getFullYear();
  const categories = ['Music', 'Technology', 'Business', 'Workshop', 'Conference', 'Festival'];
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
  ];

  return (
    <footer className="footer" id="contact">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span>✦</span> Eventify
            </Link>
            <p className="footer-desc">
              The premier platform for discovering, booking, and managing unforgettable events. From concerts to conferences, we've got you covered.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="YouTube">▶</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {links.map(l => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              {categories.map(cat => (
                <li key={cat}>
                  <Link href={`/events?category=${cat}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>📧 hello@eventify.in</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Hyderabad, Telangana, India</li>
            </ul>
            <div className="footer-newsletter">
              <p>Get event updates</p>
              <div className="newsletter-row">
                <input type="email" placeholder="Enter your email" className="form-input" />
                <button className="btn btn-primary btn-sm">Go</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Eventify. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
