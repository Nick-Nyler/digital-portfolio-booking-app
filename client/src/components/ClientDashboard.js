// src/components/ClientDashboard.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../api';

function ClientDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ── Fetch client bookings ───────────────────────────────
  const {
    data: bookingsData = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useQuery({
    queryKey: ['clientBookings'],
    queryFn: () =>
      fetch(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      }),
  });

  // ── Fetch creators list ─────────────────────────────────
  const {
    data: creatorsData = [],
    isLoading: creatorsLoading,
  } = useQuery({
    queryKey: ['creators'],
    queryFn: () =>
      fetch(`${API_URL}/users?role=creator`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (!res.ok) throw new Error('Failed to fetch creators');
        return res.json();
      }),
  });

  if (bookingsLoading || creatorsLoading) {
    return <p className="text-center text-white">Loading...</p>;
  }
  if (bookingsError) {
    return (
      <p className="text-red-500 text-center">
        Failed to load bookings: {bookingsError.message}
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ← Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6">Client Dashboard</h2>

      {/* --- Bookings Section --- */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Your Bookings</h3>
        {bookingsData.length === 0 ? (
          <p className="text-gray-300">You have no bookings yet.</p>
        ) : (
          bookingsData.map(b => (
            <div
              key={b.id}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-3 text-white"
            >
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <p><strong>Creator:</strong> {b.creator}</p>
              {b.review && (
                <p><strong>Review:</strong> {b.review.rating} – {b.review.comment}</p>
              )}
            </div>
          ))
        )}
      </motion.div>

      {/* --- Creators Section --- */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-2xl font-semibold mb-4">Available Creators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatorsData.map(creator => (
            <div
              key={creator.id}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-white"
            >
              <h4 className="text-xl font-semibold">{creator.username}</h4>
              <p><strong>Bio:</strong> {creator.bio || 'N/A'}</p>
              <p><strong>Skills:</strong> {creator.skills || 'N/A'}</p>
              <p><strong>Rate:</strong> ${creator.rate || 'N/A'} / hr</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/portfolio/${creator.id}`}
                  className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 transition"
                >
                  View Portfolio
                </Link>
                <Link
                  to={`/booking/${creator.id}`}
                  state={{ creatorName: creator.username }}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
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
