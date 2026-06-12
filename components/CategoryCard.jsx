'use client';

import Link from 'next/link';

const categoryMeta = {
  Music:       { icon: '🎵', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  Sports:      { icon: '⚽', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  Technology:  { icon: '💻', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  Business:    { icon: '💼', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Education:   { icon: '📚', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  Food:        { icon: '🍕', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  Travel:      { icon: '✈️', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  Art:         { icon: '🎨', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  Workshop:    { icon: '🛠', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
  Conference:  { icon: '🎤', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  Meetup:      { icon: '🤝', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
  Festival:    { icon: '🎉', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
};

export default function CategoryCard({ name, count }) {
  const meta = categoryMeta[name] || { icon: '📌', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' };

  return (
    <Link href={`/events?category=${name}`} className="cat-card" style={{ '--cat-color': meta.color, '--cat-bg': meta.bg }}>
      <div className="cat-icon-wrap">
        <span className="cat-icon">{meta.icon}</span>
      </div>
      <h3 className="cat-name">{name}</h3>
      {count !== undefined && (
        <p className="cat-count">{count} event{count !== 1 ? 's' : ''}</p>
      )}
      <div className="cat-arrow">→</div>
    </Link>
  );
}
