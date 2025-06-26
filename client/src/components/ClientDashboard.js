import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ClientDashboard() {
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['clientBookings'],
    queryFn: () =>
      fetch('http://localhost:5555/bookings/client', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((res) => res.json()),
  });

  const { data: creators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: () =>
      fetch('http://localhost:5555/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((res) => res.json()),
  });

  if (bookingsLoading || creatorsLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Client Dashboard</h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Your Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-300">You have no bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-3">
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <p><strong>Creator:</strong> {b.creator}</p>
              {b.review && (
                <p><strong>Review:</strong> {b.review.rating} - {b.review.comment}</p>
              )}
            </div>
          ))
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-2xl font-semibold mb-4">Available Creators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((c) => (
            <div key={c.id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
              <h4 className="text-xl font-semibold">{c.username}</h4>
              <p><strong>Bio:</strong> {c.bio || 'N/A'}</p>
              <p><strong>Skills:</strong> {c.skills || 'N/A'}</p>
              <p><strong>Rate:</strong> ${c.rate || 'N/A'} per hour</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/ratecard/${c.id}`}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  View Rate Card
                </Link>
                <Link
                  to={`/book/${c.id}`}
                  state={{ creatorName: c.username }}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ClientDashboard;
