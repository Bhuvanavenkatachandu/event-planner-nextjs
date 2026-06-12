'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './SearchBar.scss';

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search,   setSearch]   = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort') || 'latest');

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setSort(searchParams.get('sort') || 'latest');
  }, [searchParams]);

  const categories = ['', 'Music', 'Sports', 'Technology', 'Business', 'Education', 'Food', 'Travel', 'Art', 'Workshop', 'Conference', 'Meetup', 'Festival'];

  const handleSubmit = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (search)   params.set('search', search);
    if (category) params.set('category', category);
    if (sort)     params.set('sort', sort);
    router.push(`/events?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setSort('latest');
    router.push('/events');
  };

  return (
    <div className="search-bar-wrap">
      <form onSubmit={handleSubmit} className="search-form">
        {/* Search input */}
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search events, locations, organizers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <select
          className="search-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.filter(Boolean).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="search-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="latest">Latest First</option>
          <option value="date-asc">Date: Nearest</option>
          <option value="date-desc">Date: Furthest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>

        <button type="submit" className="btn btn-primary">Search</button>

        {(search || category || sort !== 'latest') && (
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Clear
          </button>
        )}
      </form>
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="search-bar-wrap" style={{ opacity: 0.5 }}>Loading search...</div>}>
      <SearchBarContent />
    </Suspense>
  );
}
