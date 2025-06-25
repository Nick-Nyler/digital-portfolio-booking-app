import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

function ClientDashboard() {
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['clientBookings'],
    queryFn: () => fetch('http://localhost:5555/bookings/client', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-300">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {bookings.map(booking => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-2"
          >
            <p>Date: {booking.date}, Time: {booking.time}, Status: {booking.status}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default ClientDashboard;
