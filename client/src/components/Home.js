import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';

function Home() {
  const { data: portfolioItems = [], isLoading, error } = useQuery({
    queryKey: ['portfolioItems'],
    queryFn: () => fetch('http://localhost:5555/portfolio-items').then(res => {
      if (!res.ok) throw new Error('Failed to fetch portfolio items');
      return res.json();
    }),
    retry: 1,
  });
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');

  const filteredItems = portfolioItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || item.category === category)
  );

  if (error) return <div className="detail-container">Error loading items: {error.message}</div>;

  return (
    <div className="home-container" role="main" aria-label="Home Page">
      <h1>Your Creative Work, One Platform</h1>
      <p>Showcase your portfolio, manage bookings, and grow your business.</p>
      <div>
        <button aria-label="Start Your Portfolio">Start Your Portfolio</button>
        <button className="explore-btn" aria-label="Explore Creators">Explore Creators</button>
      </div>
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
        aria-label="Search portfolio items"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" aria-label="Filter by category">
        <option value="">All Categories</option>
        <option value="Painting">Painting</option>
        <option value="Photography">Photography</option>
      </select>
      <div className="gallery" aria-live="polite">
        {isLoading ? (
          Array(4).fill().map((_, i) => (
            <div key={i}><Skeleton height={120} data-testid="skeleton" /></div>
          ))
        ) : filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          filteredItems.map(item => (
            <Link to={`/portfolio/${item.id}`} key={item.id} aria-label={`View ${item.title}`}>
              <div>
                <img src={item.image_url} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.category}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;