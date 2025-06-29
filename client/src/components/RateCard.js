// client/src/components/RateCard.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function RateCard() {
  const { id } = useParams();
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['portfolioItem', id],
    queryFn: () =>
      fetch(`http://localhost:5555/portfolio-items/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading rate card.</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Rate Card for {item.title}</h2>
      <p><strong>Hourly Rate:</strong> ${item.price}</p>
      <p><strong>Average Rating:</strong> {item.rating}</p>
      <p><strong>Category:</strong> {item.category}</p>
    </motion.div>
  );
}

export default RateCard;
