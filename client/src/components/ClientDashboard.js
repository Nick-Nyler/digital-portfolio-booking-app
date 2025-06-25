import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';

function ClientDashboard() {
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['clientBookings'],
    queryFn: () => fetch('http://localhost:5555/bookings/client', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.json()),
    retry: 1,
  });

  const [reviewData, setReviewData] = useState({ rating: 0, comment: '', bookingId: null });
  const reviewMutation = useMutation({
    mutationFn: (data) => axios.post(`http://localhost:5555/reviews/${data.bookingId}`, data, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }),
    onSuccess: () => toast.success('Review submitted!'),
    onError: (error) => toast.error(`Review failed: ${error.message}`),
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
            {booking.status === 'accepted' && !booking.review && (
              <div className="mt-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (1-5)"
                  onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value), bookingId: booking.id })}
                  className="p-2 rounded-lg border border-gray-300 text-black mr-2"
                />
                <input
                  type="text"
                  placeholder="Comment"
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value, bookingId: booking.id })}
                  className="p-2 rounded-lg border border-gray-300 text-black mr-2"
                />
                <button
                  onClick={() => reviewMutation.mutate(reviewData)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Submit Review
                </button>
              </div>
            )}
            {booking.review && <p className="mt-2">Review: Rating {booking.review.rating}, {booking.review.comment}</p>}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default ClientDashboard;
