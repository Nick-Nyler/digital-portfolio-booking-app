// client/src/components/RateCard.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../api';  // ← import your API_URL helper

function RateCard() {
  const { id } = useParams();
  const token = localStorage.getItem('token');

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['portfolioItem', id],
    queryFn: () =>
      fetch(`${API_URL}/portfolio-items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (!res.ok) throw new Error('Failed to fetch rate card');
        return res.json();
      }),
  });

  if (isLoading) return <p className="text-center">Loading rate card…</p>;
  if (error)     return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-4">Rate Card for {item.title}</h2>
      <div className="space-y-2 text-lg">
        <p><strong>Hourly Rate:</strong> ${item.price}</p>
        <p><strong>Average Rating:</strong> {item.rating ?? 'N/A'}</p>
        <p><strong>Category:</strong> {item.category}</p>
      </div>
    </motion.div>
  );
}

export default RateCard;
