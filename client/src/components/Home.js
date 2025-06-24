import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/portfolio-items')
      .then(response => response.json())
      .then(data => setPortfolioItems(data));
  }, []);

  return (
    <div className="home-container">
      <h1>Your Creative Work, One Platform</h1>
      <p>Showcase your portfolio, manage client bookings, and grow your creative business.</p>
      <div>
        <button>Start Your Portfolio</button>
        <button className="explore-btn">Explore Creators</button>
      </div>
      <div className="gallery">
        {portfolioItems.map(item => (
          <Link to={`/portfolio/${item.id}`} key={item.id}>
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