import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

function CreatorDashboard() {
  const queryClient = useQueryClient();
  const { data: portfolioItems = [], isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['portfolioItems'],
    queryFn: () => fetch('http://localhost:5555/portfolio-items', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });
  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => fetch('http://localhost:5555/bookings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`http://localhost:5555/portfolio-items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    }),
    onSuccess: () => queryClient.invalidateQueries(['portfolioItems']),
    onError: (error) => toast.error(`Delete failed: ${error.message}`),
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => fetch(`http://localhost:5555/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status }),
    }).then(res => {
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    }),
    onSuccess: () => queryClient.invalidateQueries(['bookings']),
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  if (itemsLoading || bookingsLoading) return <p className="text-center">Loading...</p>;
  if (itemsError || bookingsError) return <p className="text-center text-red-300">Error: {itemsError?.message || bookingsError?.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Creator Dashboard</h2>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">Your Portfolio</h3>
          {portfolioItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-2 flex justify-between items-center"
            >
              <span>{item.title}</span>
              <div>
                <button onClick={() => deleteMutation.mutate(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2">Delete</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold mb-2">Your Bookings</h3>
          {bookings.map(booking => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-2"
            >
              <p>Date: {booking.date}, Time: {booking.time}, Status: {booking.status}</p>
              <div className="mt-2">
                <button onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'accepted' })} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2">Accept</button>
                <button onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'declined' })} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Decline</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default CreatorDashboard;
