import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

function PortfolioDetail() {
  const { id } = useParams();
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['portfolioItem', id],
    queryFn: () => fetch(`http://localhost:5555/portfolio-items/${id}`).then(res => res.json()),
    retry: 1,
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-300">Error: {error.message}</p>;
  if (!item) return <p className="text-center">Item not found</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.img
        src={item.image_url}
        alt={item.title}
        className="w-full h-96 object-cover rounded-lg mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
      <p className="text-gray-300 mb-4">{item.description}</p>
      <p className="text-gray-400">Category: {item.category}</p>
      <motion.a
        href="/booking"
        className="mt-4 inline-block bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
        whileHover={{ scale: 1.05 }}
      >
        Book Now
      </motion.a>
    </motion.div>
  );
}

export default PortfolioDetail;
