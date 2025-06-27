// src/components/CreatorDashboard.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';

function CreatorDashboard() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ bio: '', skills: '', rate: '' });

  // ── Fetch Creator Profile ─────────────────────
  const { data: profile, isLoading: profileLoading, isError: profileError } = useQuery({
    queryKey: ['creatorProfile'],
    queryFn: () =>
      fetch('http://localhost:5555/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      }),
    enabled: !!localStorage.getItem('token'),
    onSuccess: (data) => {
      setFormData({
        bio: data.bio || '',
        skills: data.skills || '',
        rate: data.rate || '',
      });
    },
  });

  // ── Fetch Creator Bookings ─────────────────────
  const { data: bookingsRaw, isLoading: bookingsLoading, isError: bookingsError } = useQuery({
    queryKey: ['creatorBookings'],
    queryFn: () =>
      fetch('http://localhost:5555/bookings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      }),
  });
  const bookings = Array.isArray(bookingsRaw) ? bookingsRaw : [];

  // ── Handle Profile Input ─────────────────────
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Update Creator Profile ─────────────────────
  const updateMutation = useMutation({
    mutationFn: () =>
      axios.put(`http://localhost:5555/users/${profile?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess: () => {
      toast.success('Profile updated!');
      queryClient.invalidateQueries(['creatorProfile']);
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile?.id) return toast.error('No user ID found');
    updateMutation.mutate();
  };

  // ── Handle Booking Status ─────────────────────
  const handleStatusUpdate = (bookingId, newStatus) => {
    axios
      .patch(
        `http://localhost:5555/bookings/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then(() => {
        toast.success(`Booking ${newStatus}`);
        queryClient.invalidateQueries(['creatorBookings']);
      })
      .catch(() => toast.error('Failed to update booking status'));
  };

  // ── Loading / Error ─────────────────────
  if (profileLoading || bookingsLoading) return <p className="text-center">Loading…</p>;
  if (profileError || bookingsError) return <p className="text-center text-red-500">Error loading data.</p>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h2 className="text-3xl font-bold mb-6">Creator Dashboard</h2>

      {/* ── Profile Edit Form ───────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Your Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <input
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 text-black"
          />
          <input
            name="skills"
            placeholder="Skills (e.g. photography, editing)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 text-black"
          />
          <input
            type="number"
            name="rate"
            placeholder="Rate per hour ($)"
            value={formData.rate}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 text-black"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>

      {/* ── Bookings Section ───────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-2xl font-semibold mb-4">Your Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-300">No bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-3">
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Client:</strong> {b.client_name}</p>
              <p><strong>Status:</strong> {b.status}</p>
              {b.status === 'pending' && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(b.id, 'accepted')}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(b.id, 'denied')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </motion.div>

      {/* ── Pricing CTA ───────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
        <Link
          to="/pricing"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          View Pricing Plans
        </Link>
      </motion.div>
    </div>
  );
}

export default CreatorDashboard;
