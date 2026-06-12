'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())                      errs.name            = 'Name is required.';
    if (!form.email.includes('@'))              errs.email           = 'Please enter a valid email.';
    if (form.password.length < 6)              errs.password        = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('auth-change'));
        setSuccess(`Account created! Welcome, ${data.user.name}! Redirecting...`);
        setTimeout(() => { router.push('/'); router.refresh(); }, 1500);
      } else {
        setErrors({ submit: data.message || 'Registration failed.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Eventify and start discovering amazing events</p>
        </div>

        {errors.submit && <div className="alert alert-error">⚠️ {errors.submit}</div>}
        {success       && <div className="alert alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-input" placeholder="John Doe"
              value={form.name} onChange={handleChange} autoComplete="name" required />
            {errors.name && <p className="form-error">⚠️ {errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handleChange} autoComplete="email" required />
            {errors.email && <p className="form-error">⚠️ {errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPw ? 'text' : 'password'} className="form-input"
                placeholder="Minimum 6 characters" value={form.password} onChange={handleChange}
                autoComplete="new-password" required />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="form-error">⚠️ {errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input name="confirmPassword" type={showPw ? 'text' : 'password'} className="form-input"
              placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange}
              autoComplete="new-password" required />
            {errors.confirmPassword && <p className="form-error">⚠️ {errors.confirmPassword}</p>}
          </div>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            🔒 All new accounts are created as <strong>regular users</strong>. Admin accounts are assigned manually.
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
