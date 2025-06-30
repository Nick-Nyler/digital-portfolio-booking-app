// src/components/Home.js
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_URL } from '../api';

function Home() {
  const { data: portfolioItems = [], isLoading, error } = useQuery({
    queryKey: ['portfolioItems'],
    queryFn: async () => {
      const publicRes = await fetch(`${API_URL}/public-portfolio-items`);
      if (!publicRes.ok) throw new Error('Fetch failed');
      const publicItems = await publicRes.json();

      const token = localStorage.getItem('token');
      if (!token) return publicItems;
      try {
        const privateRes = await fetch(`${API_URL}/portfolio-items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!privateRes.ok) return publicItems;
        const privateItems = await privateRes.json();
        return [...publicItems, ...privateItems];
      } catch {
        return publicItems;
      }
    },
    retry: 1,
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);

  const filteredItems = portfolioItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || item.category === category) &&
    (!rating || item.rating >= rating)
  );

  return (
    <div className="min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16 bg-gradient-to-b from-purple-800 to-blue-700"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Artify</h1>
        <p className="text-lg mb-6">
          Unleash your creativity with stunning portfolios and seamless bookings.
        </p>
        <Link to="/signup?role=creator">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
          >
            Start Creating
          </motion.button>
        </Link>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 text-black"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 text-black"
          >
            <option value="">All Categories</option>
            <option value="Painting">Painting</option>
            <option value="Photography">Photography</option>
            <option value="Sculpture">Sculpture</option>
          </select>
          <input
            type="range"
            min="0"
            max="5"
            value={rating}
            onChange={e => setRating(+e.target.value)}
            className="p-2 rounded-lg border border-gray-300 text-black"
            title="Minimum rating"
          />
        </div>

        {isLoading && <p className="text-center text-white">Loading...</p>}
        {error && (
          <p className="text-center text-red-300">
            Error loading items: {error.message}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg"
            >
              <Link to={`/portfolio/${item.id}`} className="block">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-white">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-300">{item.category}</p>
                  <p>Price: ${item.price}</p>
                  <p>Rating: {item.rating ?? 'N/A'}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
