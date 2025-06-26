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

  const { data: creatorsData, isLoading: creatorsLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: () =>
      fetch('http://localhost:5555/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((res) => res.json()),
  });

  const creators = Array.isArray(creatorsData) ? creatorsData : [];

  if (bookingsLoading || creatorsLoading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Client Dashboard</h2>

      {/* Bookings Section */}
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

      {/* Creators Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-2xl font-semibold mb-4">Available Creators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <div key={creator.id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
              <h4 className="text-xl font-semibold">{creator.username}</h4>
              <p><strong>Bio:</strong> {creator.bio || 'N/A'}</p>
              <p><strong>Skills:</strong> {creator.skills || 'N/A'}</p>
              <p><strong>Rate:</strong> ${creator.rate || 'N/A'} per hour</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/portfolio/${creator.id}`}
                  className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600"
                >
                  View Portfolio
                </Link>
                <Link
                  to={`/book/${creator.id}`}
                  state={{ creatorName: creator.username }}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pricing Link */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 text-center">
        <Link
          to="/pricing"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          View Pricing Plans
        </Link>
      </motion.div>
    </div>
  );
}

export default ClientDashboard;
