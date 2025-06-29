import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = process.env.REACT_APP_API_URL || 'https://artify-api-pkxy.onrender.com';

function PortfolioDetail() {
  const { id: creatorId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/public-portfolio-items`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch portfolio items');
        return res.json();
      })
      .then(data => {
        const filtered = data.filter(item => item.user_id === Number(creatorId));
        setItems(filtered);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [creatorId]);

  if (loading) return <p className="text-center">Loading portfolio…</p>;
  if (error)    return <p className="text-center text-red-300">Error loading portfolio items.</p>;
  if (!items.length) return <p className="text-center">No portfolio items found for this creator.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Creator’s Portfolio
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-gray-300">{item.category}</p>
              <p>Price: ${item.price}</p>
              <p>Rating: {item.rating || 'N/A'}</p>

              <Link
                to={`/book/${item.user_id}`}
                state={{ creatorName: item.creator }}
                className="mt-3 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Book This Creator
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioDetail;
