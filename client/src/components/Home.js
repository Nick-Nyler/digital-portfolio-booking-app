import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Home() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5555/portfolio-items')
      .then(response => response.json())
      .then(data => setPortfolioItems(data))
      .catch(error => console.error('Fetch error:', error))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = portfolioItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || item.category === category)
  );

  return (
    <div className="home-container">
      <h1>Your Creative Work, One Platform</h1>
      <p>Showcase your portfolio, manage client bookings, and grow your creative business.</p>
      <div>
        <button>Start Your Portfolio</button>
        <button className="explore-btn">Explore Creators</button>
      </div>
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
        <option value="">All Categories</option>
        <option value="Painting">Painting</option>
        <option value="Photography">Photography</option>
      </select>
      <div className="gallery">
        {loading ? (
          Array(4).fill().map((_, i) => (
            <div key={i}><Skeleton height={150} /></div>
          ))
        ) : filteredItems.map(item => (
          <Link to={/portfolio/${item.id}} key={item.id}>
            <div>
              <img src={item.image_url} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;