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
    <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Your Creative Work, One Platform</h1>
      <p className="text-gray-600 mb-6">Showcase your portfolio, manage client bookings, and grow your creative business with our all-in-one platform designed for artists, designers, and creative professionals.</p>
      <div className="space-x-4 mb-8">
        <button className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">Start Your Portfolio</button>
        <button className="bg-white text-gray-800 px-6 py-3 rounded border border-gray-300 hover:bg-gray-100">Explore Creators</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {portfolioItems.map(item => (
          <Link to={`/portfolio/${item.id}`} key={item.id} className="bg-white p-4 rounded shadow hover:shadow-lg">
            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
            <p className="text-gray-600">{item.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;