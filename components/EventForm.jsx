'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Music','Sports','Technology','Business','Education','Food','Travel','Art','Workshop','Conference','Meetup','Festival','Other'];

export default function EventForm({ mode = 'create', eventData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title:         eventData?.title         || '',
    description:   eventData?.description   || '',
    category:      eventData?.category      || 'Technology',
    date:          eventData?.date ? new Date(eventData.date).toISOString().split('T')[0] : '',
    time:          eventData?.time          || '',
    location:      eventData?.location      || '',
    image:         eventData?.image         || '',
    organizerName: eventData?.organizerName || '',
    totalSeats:    eventData?.totalSeats    || '',
    price:         eventData?.price         ?? 0,
    featured:      eventData?.featured      || false,
    status:        eventData?.status        || 'upcoming',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    if (!form.title.trim())         return 'Event title is required.';
    if (!form.description.trim())   return 'Description is required.';
    if (!form.category)             return 'Category is required.';
    if (!form.date)                 return 'Event date is required.';
    if (!form.time)                 return 'Event time is required.';
    if (!form.location.trim())      return 'Location is required.';
    if (!form.organizerName.trim()) return 'Organizer name is required.';
    if (!form.totalSeats || Number(form.totalSeats) < 1) return 'Total seats must be at least 1.';
    if (Number(form.price) < 0)     return 'Price cannot be negative.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const token  = localStorage.getItem('token');
      const url    = mode === 'edit' ? `/api/events/${eventData._id}` : '/api/events';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), totalSeats: Number(form.totalSeats) }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(mode === 'edit' ? 'Event updated successfully!' : 'Event created successfully!');
        setTimeout(() => router.push('/admin/manage-events'), 1500);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Event Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="e.g. Future Tech Summit 2026" required />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="form-select">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" rows={4} placeholder="Describe your event..." required />
      </div>

      <div className="form-grid-3">
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Time *</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="form-select">
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Location *</label>
          <input name="location" value={form.location} onChange={handleChange} className="form-input" placeholder="e.g. Hyderabad Convention Centre" required />
        </div>
        <div className="form-group">
          <label className="form-label">Organizer Name *</label>
          <input name="organizerName" value={form.organizerName} onChange={handleChange} className="form-input" placeholder="e.g. TechWorld India" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Event Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} className="form-input" placeholder="https://..." />
        {form.image && (
          <img src={form.image} alt="Preview" style={{ marginTop: '0.5rem', height: '120px', objectFit: 'cover', borderRadius: '10px', width: '100%' }} onError={e => e.target.style.display = 'none'} />
        )}
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Total Seats *</label>
          <input type="number" name="totalSeats" value={form.totalSeats} onChange={handleChange} className="form-input" min={1} placeholder="e.g. 200" required />
        </div>
        <div className="form-group">
          <label className="form-label">Price (₹)</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="form-input" min={0} placeholder="0 for Free" />
        </div>
      </div>

      <div className="form-group">
        <label className="featured-check">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          <span>⭐ Mark as Featured Event</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/manage-events')}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ Saving...' : mode === 'edit' ? '✏️ Update Event' : '🚀 Create Event'}
        </button>
      </div>
    </form>
  );
}
