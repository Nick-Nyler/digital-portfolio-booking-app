import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

function Creators() {
  const { data: creators = [], isLoading, error } = useQuery({
    queryKey: ['creators'],
    queryFn: () => fetch('https://artify-api-pkxy.onrender.com/users').then(res => res.json()),
    retry: 1,
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-300">Error: {error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold mb-6">Creators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map(creator => (
          <motion.div
            key={creator.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold">{creator.username}</h3>
            <p className="text-gray-300">{creator.email}</p>
            <p className="text-gray-400">{creator.bio || 'No bio available'}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Creators;
